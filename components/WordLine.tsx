import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Text, View } from '../components/Themed';

export default function WordLine(props) {
    const { data } = props;
    const { word, translate, star } = data;
    const [favorite, setFavorite] = useState(star)
    return (
        <View style={{ flexDirection: 'row', marginHorizontal: 5, padding: 10, borderBottomWidth: 1 }}>
            <View style={{ flex: 1 }}>
                <Text>{word}</Text>
                <Text>{translate}</Text>
            </View>
            <TouchableOpacity onPress={() => setFavorite(!favorite)}>
                <View style={{ justifyContent: 'center' }}>
                    {favorite ?
                        <AntDesign name="staro" size={24} color="black" /> :
                        <AntDesign name="star" size={24} color="yellow" />
                    }
                </View>
            </TouchableOpacity>

        </View>
    )

}
