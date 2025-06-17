import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { theme } from '../..';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon, CalendarDaysIcon } from 'react-native-heroicons/solid';
import { fetchLocations, fetchWeatherForecast } from '../api/weatherapi';
import { weatherImages } from '../constants';
import * as progress from 'react-native-progress';
import { getData, storeData } from '../utils/asyncStorage';

function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState<{ name: string; country: string }[]>([]);
  const [weather, setWeather] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyWeatherForecast();
  }, []);

  const fetchMyWeatherForecast = async () => {
    try {
      let city = await getData('city');
      let cityName = city ? city : 'London';
      const data = await fetchWeatherForecast({ cityName: cityName, day: 7 });
      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
  };

  const handleSearch = (value: string) => {
    if (!value) return;
    fetchLocations({ cityName: value }).then((data: any) => {
      setLocations(data);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const handleLocation = (loc: { name: string }) => {
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({ cityName: loc.name, day: 7 }).then((data: string) => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 relative">
          <StatusBar barStyle="light-content" />
          <Image
            blurRadius={100}
            source={require('../images/bg.png')}
            className="absolute h-full w-full"
          />

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <progress.CircleSnail thickness={10} size={150} color={theme.bgWhite(0.3)} />
            </View>
          ) : (
            <SafeAreaView className="flex flex-1">
              {/* Search Bar */}
              <View style={{ height: '7%' }} className="mx-4 relative mt-4 z-50">
                <View
                  className="flex-row justify-end items-center rounded-full p-2"
                  style={{
                    borderRadius: showSearch ? 9999 : 50,
                    backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent',
                  }}
                >
                  {showSearch ? (
                    <TextInput
                      onChangeText={handleTextDebounce}
                      placeholder="Search city"
                      placeholderTextColor="lightgray"
                      className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                    />
                  ) : null}

                  <TouchableOpacity
                    onPress={() => toggleSearch(!showSearch)}
                    style={{ backgroundColor: theme.bgWhite(0.3) }}
                    className="rounded-full p-3 m-1"
                  >
                    <MagnifyingGlassIcon size={25} color="lightgrey" />
                  </TouchableOpacity>
                </View>

                {locations.length > 0 && showSearch ? (
                  <View
                    className={clsx(
                      'absolute w-full top-20 px-4 py-2',
                      showSearch && 'bg-gray-300 rounded-3xl'
                    )}
                  >
                    {locations.map((loc, index) => {
                      let showBorder = index + 1 !== locations.length;
                      let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                      return (
                        <TouchableOpacity
                          onPress={() => handleLocation(loc)}
                          key={index}
                          className={'flex-row items-center border-0 p-3 px-4 mb-1 ' + borderClass}
                        >
                          <MapPinIcon size={28} color="grey" />
                          <Text className="text-black text-lg ml-2">
                            {loc?.name}, {loc.country}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              {/* Forecast Main Section */}
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* Location Name */}
                <Text className="text-white text-center text-3xl font-bold">
                  {weather?.location?.name},
                  <Text className="text-lg font-semibold text-gray-300">
                    {'  ' + weather?.location?.country}
                  </Text>
                </Text>

                {/* Weather Icon */}
                <View className="flex-row justify-center">
                  <Image
                    source={weatherImages[weather?.current?.condition?.text]}
                    className="w-52 h-52"
                  />
                </View>

                {/* Temperature and Status */}
                <View className="space-y-2">
                  <Text className="text-center font-bold text-white text-6xl ml-5">
                    {weather?.current?.temp_c}&#176;
                  </Text>
                  <Text className="text-center text-white text-xl tracking-widest">
                    {weather?.current?.condition?.text}
                  </Text>
                </View>

                {/* Weather Stats */}
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../icons/wind.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      {weather?.current?.wind_kph}km
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../icons/drop.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      {weather?.current?.humidity}%
                    </Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../icons/sun.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Daily Forecast */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <CalendarDaysIcon size={25} color="white" />
                  <Text className="text-white text-base">Daily Forecast</Text>
                </View>

                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {weather?.forecast?.forecastday.map((item: any, index: number) => {
                    let date = new Date(item?.date);
                    let options: Intl.DateTimeFormatOptions = { weekday: 'long' };
                    let dayName = date.toLocaleDateString('en-US', options).split(',')[0];

                    return (
                      <View
                        key={index}
                        className="flex justify-center items-center w-24 mt-4 rounded-3xl py-3 space-y-1 mr-4"
                        style={{ backgroundColor: theme.bgWhite(0.15) }}
                      >
                        <Image
                          source={weatherImages[item?.day?.condition?.text]}
                          className="w-11 h-11"
                        />
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white text-xl font-semibold">
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </SafeAreaView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default HomeScreen;
