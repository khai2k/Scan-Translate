import * as React from 'react';
import { ScrollView } from 'react-native'
import WordLine from '../components/WordLine';
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
export default function TabTwoScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {wordHistory.map((data, index) => {
        return <WordLine key={index} data={data} />
      })}
    </ScrollView>
  );
}

