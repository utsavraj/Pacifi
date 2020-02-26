# Pacifi Backend

## Requirements to host app locally
* The mobile app uses the following two frameworks:
  <ol>
    <li>React Native as its frontend</li>
    <li>Django as its backend</li>
  </ol>
<i>Note We need to start these apps separately. Here we describe running the <strong>backend</strong> app locally.<strong> Make sure to follows all these steps in sequence</strong></i>


## Terminal Window: Django

* Go to Backtrack File: `~/PATH-TO-Pacifi//pacifi-backend`

* Run the below code to install all required libraries.
   * For **Python 2**:`pip install -r requirements.txt`
   * For **Python 3**: `pip3 install -r requirements.txt`

* Start the Backtrack app: `python manage.py runserver`
* Start the ngrok server to host the local app on a server online[explained below]<br>
  &nbsp;<i>Note: We need to host using ngrok because react native cannot send requests on http but requires https for security</i>


## Terminal Window: ngrok

* Install ngrok using the official website

* Navigate/`cd` into the directory where ngrok.exe is downloaded

* Give the following command `ngrok http 8000`

* Upon hitting enter it generates two urls(one with http and one with https). Copy the one with https.

* Add the copied url in the `~\pacifyBackend\pacifyBackend\settings.py` file under ALLOWED_HOSTS list as follows:
  &nbsp; for example, if copied url is: https://a7cc3c90.ngrok.io, then the updated ALLOWED_HOSTS = [ 'a7cc3c90.ngrok.io', '127.0.0.1' ]

* Replace the API_URL constant value in `\pacify-frontend\src\config.js` by this copied url(one with https). Now all requests from frontend app will be made to this url which will be forwarded to django local server => `localhost:8000` 

* <i>Note: Ngrok only hosts for about 8 hours and after that you need to restart and obtain a new url with https</i>.


