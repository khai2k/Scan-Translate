// // import 'react-native-gesture-handler';
// // import { StatusBar } from 'expo-status-bar';
// // import React from 'react';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';

// // import useCachedResources from './hooks/useCachedResources';
// // import useColorScheme from './hooks/useColorScheme';
// // import Navigation from './navigation';

// // export default function App() {
// //   const isLoadingComplete = useCachedResources();
// //   const colorScheme = useColorScheme();

// //   if (!isLoadingComplete) {
// //     return null;
// //   } else {
// //     return (
// //       <SafeAreaProvider>
// //         <Navigation colorScheme={colorScheme} />
// //         <StatusBar />
// //       </SafeAreaProvider>
// //     );
// //   }
// // }

// import * as React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { Audio } from 'expo-av';

// export default function App() {
//   const [sound, setSound] = React.useState();

//   async function playSound() {
//     console.log('Loading Sound');
//     const { sound } = await Audio.Sound.createAsync(
//       {
//         uri: "https://translate.google.com/translate_tts?ie=UTF-8&q=hello%20name&tl=en&total=1&idx=0&textlen=7&client=tw-ob&prev=input&ttsspeed=1.m3u8"
//       },
//       true
//     );

//     // const { sound } = await Audio.Sound.createAsync(
//     //   require('./translate_tts.mp3')
//     // );
//     console.log('Playing Sound');
//     // await sound.setPositionAsync(50);
//     await sound.playAsync();
//     // await sound.unloadAsync();
//   }

//   // React.useEffect(() => {
//   //   return sound
//   //     ? () => {
//   //         console.log('Unloading Sound');
//   //         sound.unloadAsync(); }
//   //     : undefined;
//   // }, [sound]);

//   return (
//     <View style={{margin:100}}>
//       <Button title="Play Sound ned" onPress={()=>playSound()} />
//     </View>
//   );
// }
