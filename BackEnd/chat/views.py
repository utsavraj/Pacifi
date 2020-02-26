from django.http import HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, permissions
from django.contrib.auth.models import User
from .serializers import MessagesSerializer
from werkzeug.utils import secure_filename
import os, re, os.path, requests, json

from ibm_watson import ToneAnalyzerV3
from ibm_cloud_sdk_core.authenticators import BasicAuthenticator
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

from .models import Messages as messages, Emotions as emotions, Breathe as breathe, Jogging as jogging, Doodling as doodle
import datetime

#May need to be changed
authenticator = IAMAuthenticator('-AblMikTM9DRTW6fVV5hkElzG4L3eaMDgtV27Wu1JYZV')
tone_analyzer = ToneAnalyzerV3(
            version='2017-09-21',
            authenticator=authenticator
            )
#May need to be changed
tone_analyzer.set_service_url('https://gateway.watsonplatform.net/tone-analyzer/api')


def userInstance(name):
    return User.objects.get(username=name)

# for receiving messages sent by bot and the user, analyzing those and storing those to database
@api_view(['POST'])
def receiveMessages(request):
    print(request.data["owner"])
    if request.data["owner"] == "sheheryar":
        m = messages(owner=userInstance(request.data["owner"]), receiver=userInstance(request.data["receiver"]), content=request.data["message"], createdAt=request.data["date"], anger=0.0, analytical=0.0, confident=0.0, tentative=0.0, fear=0.0, joy=0.0, sadness=0.0)
        m.save()
    else:
        text = request.data["message"]

        # Contains the tone-values as well as sentence tones
        tone_analysis = tone_analyzer.tone(
            {'text': text},
            content_type='application/json'
        ).get_result()

        tone_value = {}
        tone_value["Anger"] = 0.0
        tone_value["Analytical"] = 0.0
        tone_value["Confident"] = 0.0
        tone_value["Tentative"] = 0.0
        tone_value["Fear"] = 0.0
        tone_value["Joy"] = 0.0
        tone_value["Sadness"] = 0.0

        for i in tone_analysis["document_tone"]["tones"]:
            print(i)
            tone_value[str(i["tone_name"])] = round(i["score"], 2)

        m = messages(owner=userInstance(request.data["owner"]), receiver=userInstance(request.data["receiver"]),
                     content=request.data["message"], createdAt=request.data["date"], anger=tone_value["Anger"], analytical=tone_value["Analytical"],
                     confident=tone_value["Confident"], tentative=tone_value["Tentative"], fear=tone_value["Fear"], joy=tone_value["Joy"], sadness=tone_value["Sadness"])
        m.save()

    print("message saved!")

    return Response({'stat': "success"})

def getEmotions(file):
    face_api_url = 'https://magnets.cognitiveservices.azure.com/face/v1.0/detect'
    headers = {'Content-Type': 'application/octet-stream', 'Ocp-Apim-Subscription-Key': '88feed36bbe545359ce64bc98b225dca'}

    params = {
        'returnFaceId': 'true',
        'returnFaceLandmarks': 'false',
        'returnFaceAttributes': 'emotion',
}

    data = open(file, 'rb').read()
    response = requests.post(face_api_url, params=params,
                             headers=headers, data=data)
    res = response.json()

    tone_value = []
    if res != []:
        tone_value = res[0]['faceAttributes']['emotion']
    return tone_value


def handle_uploaded_file(f):
    with open('./chat/hello.jpg', 'wb+') as destination:
        print("File opened")
        for chunk in f.chunks():
            destination.write(chunk)


@api_view(['POST'])
def processImage(request):
    files = request.FILES['photo']
    print(files)
    handle_uploaded_file(request.FILES['photo'])

    tone_value = getEmotions("./chat/hello.jpg")
    if tone_value != [] :
        e = emotions(user=request.user, anger=tone_value["anger"], contempt=tone_value["contempt"],
                     disgust=tone_value["disgust"], fear=tone_value["fear"], happiness=tone_value["happiness"],
                     neutral=tone_value["neutral"], sadness=tone_value["sadness"], surprise=tone_value["surprise"])
        e.save()
        sum = float(tone_value["anger"] + tone_value["sadness"] + tone_value["happiness"])
        if sum == 0:
            sum = 1
        anger = (float(tone_value["anger"])/sum)*100
        sadness = (float(tone_value["sadness"]) / sum) * 100
        happiness = (float(tone_value["happiness"]) / sum) * 100

        return Response({'stat': "success", "anger": int(anger), "sadness": int(sadness), "happiness": int(happiness)})
    print("No face detected!")
    return Response({'stat': "success"})

# for deleting all the previously stored messages upon first opening the app
@api_view(['POST'])
def clearChat(request):
    try:
        q1 = messages.objects.filter(owner=userInstance("sheheryar"), receiver=userInstance(request.data["user"])).delete()
    except:
        print("message doesnot exist")
    try:
        q2 = messages.objects.filter(owner=userInstance(request.data["user"])).delete()
    except:
        print("message doesnot exist")
    try:
        q3 = emotions.objects.filter(user=userInstance(request.data["user"])).delete()
    except:
        print("emotions doesnot exist")
    try:
        q4 = breathe.objects.filter(person=userInstance(request.data["user"])).delete()
    except:
        print("breathe doesnot exist")
    try:
        q5 = jogging.objects.filter(person=userInstance(request.data["user"])).delete()
    except:
        print("jogging doesnot exist")
    try:
        q6 = doodle.objects.filter(person=userInstance(request.data["user"])).delete()
    except:
        print("doodle doesnot exist")


    return Response({'stat': "success"})


# for saving the breathing time in database
@api_view(['POST'])
def saveBreathe(request):
    try:
        time = datetime.time(0, int(request.data["minutes"]), int(request.data["seconds"]))
        b = breathe(person=userInstance(request.data["owner"]), time=time)
        b.save()
    except:
        print("Error in saving data!")

    return Response({'stat': "success"})

# for saving the breathing time in database
@api_view(['POST'])
def saveDoodling(request):
    try:
        time = datetime.time(0, int(request.data["minutes"]), int(request.data["seconds"]))
        d = doodle(person=userInstance(request.data["owner"]), time=time)
        d.save()
    except:
        print("Error in saving data!")

    return Response({'stat': "success"})

# for saving the breathing time in database
@api_view(['POST'])
def saveJogging(request):
    try:
        j = jogging(person=userInstance(request.data["owner"]), steps=int(request.data["steps"]))
        j.save()
    except:
        print("Error in saving data!")

    return Response({'stat': "success"})

# for getting the chat in case the component is rebuilt
@api_view(['POST'])
def getChat(request):
    print("getChat() called!")

    return Response({'stat': "success"})

# getting the values for stress wheel
@api_view(['POST'])
def StressWheel(request):
    print(request.data["owner"])
    files = request.FILES['photo']
    handle_uploaded_file(request.FILES['photo'])

    tone_value = getEmotions("./chat/hello.jpg")
    if tone_value != []:
        e = emotions(user=request.user, anger=tone_value["anger"], contempt=tone_value["contempt"],
                     disgust=tone_value["disgust"], fear=tone_value["fear"], happiness=tone_value["happiness"],
                     neutral=tone_value["neutral"], sadness=tone_value["sadness"], surprise=tone_value["surprise"])
        e.save()

    anger = 0.0
    saddness = 0.0
    happiness = 0.0
    sum = 0.0
    emo = emotions.objects.all().filter(user=userInstance(request.data["owner"]))
    for emotion in emo:
        anger += emotion.anger
        saddness += emotion.sadness
        happiness += emotion.happiness
        sum += emotion.sadness + emotion.happiness+emotion.anger

    nlp = messages.objects.all().filter(owner=userInstance(request.data["owner"]))
    for message in nlp:
        anger += message.anger
        saddness += message.sadness
        happiness += message.joy
        sum += message.sadness + message.joy + message.anger

    joggs = jogging.objects.all().filter(person=userInstance(request.data["owner"]))
    for jog in joggs:
        happ, ang, sad = JoggingAlgo(jog.steps)
        anger += ang
        saddness += sad
        happiness += happ
        sum += saddness + happiness + anger

    breathes = breathe.objects.all().filter(person=userInstance(request.data["owner"]))
    for breath in breathes:
        seconds = str(breath.time)
        h, m, s = seconds.split(':')
        print(int(h) * 3600 + int(m) * 60 + int(s))
        happ, ang, sad = BreathingAlg(int(h) * 3600 + int(m) * 60 + int(s))
        anger += ang
        saddness += sad
        happiness += happ
        sum += saddness + happiness + anger

    doods = doodle.objects.all().filter(person=userInstance(request.data["owner"]))
    for dood in doods:
        seconds = str(dood.time)
        h, m, s = seconds.split(':')
        print(int(h) * 3600 + int(m) * 60 + int(s))
        happ, ang, sad = DoodlingAlg(int(h) * 3600 + int(m) * 60 + int(s))
        anger += ang
        saddness += sad
        happiness += happ
        sum += saddness + happiness + anger

    if sum == 0:
        sum = 1
    anger = (float(anger) / sum) * 100
    sadness = (float(saddness) / sum) * 100
    happiness = (float(happiness) / sum) * 100

    return Response({'stat': "success", "anger": int(anger), "sadness": int(sadness), "happiness": int(happiness)})



def BreathingAlg(Breathing_Time):
    # https://www.health.harvard.edu/newsletter_article/By_the_way_doctor_Can_a_deep-breathing_device_help_lower_my_blood_pressure
    AverageBreathing = 750

    # https://www.tandfonline.com/doi/abs/10.1080/02699930143000392
    HappinessIndex = 0.4
    SadnessIndex = -0.4
    AngerIndex = -0.4

    if Breathing_Time >= AverageBreathing:
        return HappinessIndex, AngerIndex, SadnessIndex
    else:
        ratio = (Breathing_Time / AverageBreathing)
        return HappinessIndex * ratio, AngerIndex * ratio, SadnessIndex * ratio


def DoodlingAlg(Doodling_Time):
    # https://www.psychologytoday.com/us/blog/arts-and-health/201706/coloring-doodling-and-drawing-recent-research

    AverageDoodling = 600

    # https://www.researchgate.net/publication/317424089_Coloring_Versus_Drawing_Effects_of_Cognitive_Demand_on_Mood_Repair_Flow_and_Enjoyment
    HappinessIndex = 0.234
    SadnessIndex = -0.158
    AngerIndex = -0.158

    if Doodling_Time >= AverageDoodling:
        return [HappinessIndex, AngerIndex, SadnessIndex]
    else:
        ratio = (Doodling_Time / AverageDoodling)
        return [HappinessIndex * ratio, AngerIndex * ratio, SadnessIndex * ratio]


def JoggingAlgo(StepCount):
    # https://www.nytimes.com/2018/05/02/well/move/even-a-little-exercise-might-make-us-happier.html
    HappinessIndex = 0.30

    # https://www.academia.edu/23836661/Relation_of_Low_and_Moderate_Intensity_Exercise_With_Acute_Mood_Change_in_College_Joggers

    AngerIndex = -0.2727
    SadnessIndex = -0.35

    # https://www.health.harvard.edu/blog/10000-steps-a-day-or-fewer-2019071117305
    AverageSteps = 4400

    if StepCount >= AverageSteps:
        return HappinessIndex, AngerIndex, SadnessIndex
    else:
        ratio = (StepCount / AverageSteps)
        return HappinessIndex * ratio, AngerIndex * ratio, SadnessIndex * ratio
