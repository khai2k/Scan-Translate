import * as React from 'react';
import { StyleSheet, TextInput, Dimensions, ScrollView, TouchableOpacity, Keyboard } from 'react-native';

import { Text, View } from '../components/Themed';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { useEffect } from 'react';
import WordLine from '../components/WordLine';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;



const wordHistory = [
  {
    word: 'Bottle',
    translate: 'Chai',
    star: true
  },
  {
    word: 'hello',
    translate: 'xin chao',
    star: false
  }
]
function renderHistory() {

  return (
    <ScrollView>
      {wordHistory.map((data, index) => {
        return <WordLine key={index} data={data} />
      })}
    </ScrollView>
  )
}
const translateApi = 'https://api.mymemory.translated.net/get'
export default function TabOneScreen(props) {
  const [ENtoVN, setENtoVN] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  useEffect(() => {
    const fetchData = async (input, ENtoVN) => {
      const langpair = ENtoVN ? 'en|vie' : 'vie|en'
      // https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|it
      if (input == '') return;
      try {
        let url = `${translateApi}?q=${input}&langpair=${langpair}`
        let { data } = await axios.get(url)
        setOutput(data.responseData.translatedText);
      } catch (error) {
        setOutput('No internet Or word not found')
      }
    }
    if (translate) fetchData(input, ENtoVN);

  }, [translate, reRender])

  return (
    <View style={styles.container}>
      {renderInput()}
      {translate && renderOutput()}
      {renderHistory()}
    </View>
  );
  function renderOutput() {
    return (
      <View style={{ flex: 1, padding: 10, backgroundColor: 'blue' }}>
        <Text style={{ color: 'white' }} >{output}</Text>
      </View>
    )
  }
  function renderInput() {
    return (
      <View style={{ height: 200, width: windowWidth, borderBottomWidth: 1 }}>
        <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1 }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text>{ENtoVN ? "English" : "Vietnamese"}</Text>
          </View>
          <TouchableOpacity onPress={() => setENtoVN(!ENtoVN)}>
            <AntDesign name="retweet" size={24} color="black" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text>{ENtoVN ? "Vietnamese" : "English"}</Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 10, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <TextInput onSubmitEditing={() => { setTranslate(true); setReRender(!reRender); Keyboard.dismiss() }}
              value={input} onChangeText={text => { setInput(text) }}
              placeholder="Enter text" style={{ height: 200 }} multiline />
          </View>
          <TouchableOpacity style={{ padding: 5 }} onPress={() => { setTranslate(false); setInput('') }} >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', paddingVertical: 10, borderTopWidth: 1 }}>
          <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => props.navigation.navigate('Camera')}>
            <AntDesign name="camera" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => props.navigation.navigate('Gallery')}>
            <AntDesign name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
