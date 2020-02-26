import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1 } from '../static/entries';

const SLIDER_1_FIRST_ITEM = 1;
APPBAR_HEIGHT = Platform.select({
    ios: 44,
    android: 44,
    default: 64,
  });
  
export default class Jogging extends Component {


  static navigationOptions = {
    headerTitle: "Jog" , 
    headerStyle: {
      backgroundColor: '#000000',
      height: APPBAR_HEIGHT,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
  };

    constructor (props) {
        super(props);
        this._renderItemWithParallax = this._renderItemWithParallax.bind(this);
        this._renderItem = this._renderItem.bind(this);
        this._renderDarkItem = this._renderDarkItem.bind(this);
        this._renderLightItem = this._renderLightItem.bind(this);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} username={this.props.username} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
      console.log(this.props.username);
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
              username={this.props.username}
            />
        );
    }

    _renderLightItem ({item}) {
        return <SliderEntry data={item} even={false} username={this.props.username} />;
    }

    _renderDarkItem ({item}) {
        return <SliderEntry data={item} even={true} username={this.props.username} />;
    }

    mainExample () {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>{`Choose The Genre of Music`}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }


    customExample (number, title, refNumber, renderItemFunc) {
        const isEven = refNumber % 2 === 0;
    }

    render () {
        const example1 = this.mainExample(1);

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <StatusBar
                      translucent={true}
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                        { example1 }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
