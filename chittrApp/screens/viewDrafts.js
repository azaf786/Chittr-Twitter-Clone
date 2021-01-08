import React, { Component } from 'react';
import {
    Text,
    Button,
    FlatList,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, Title} from 'react-native-paper';
import Moment from 'moment';
const styles = StyleSheet.create({





});
class Following extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            isLoad: true,
            drafts: []
        };
    }

    getDrafts = async () => {
        let drafts = await AsyncStorage.getItem("draftChits");
        //console.log(JSON.parse(drafts));
        // await AsyncStorage.removeItem("draftChits");
        this.setState({drafts: drafts});
    };

    componentDidMount() {
        this.getDrafts();
    }

    render() {
        return (
                <View style={styles.container}>
                    <View>
                        {/*{ this.state.drafts[0].items.map((item) => (*/}
                        {/*    <View>*/}
                        {/*        <Text>{item.chit_content}</Text>*/}
                        {/*        /!*<Text>{item.start.dateTime}</Text>*!/*/}
                        {/*        /!*<Text>{item.description}</Text>*!/*/}
                        {/*    </View>*/}
                        {/*))}*/}
                    </View>

                    <Text style={styles.userText}> Draft Chits </Text>
                    <Text> {this.state.drafts}</Text>
                    <Card
                        // content={JSON.parse(this.state.drafts.chit_content)}
                        bottomRightText={''}
                        onPress={() =>this.props.navigation.navigate('ViewDrafts')}
                    />
                    <Card Style={styles.mainCard}>
                        <View style={styles.chitInfo}>
                            <Card.Title title={this.state.drafts.chit_content} />
                        </View>
                        <Card.Content>

                            {/*<Paragraph>{item.chit_content}</Paragraph>*/}
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                        {/*<Card.Actions>*/}
                        {/*    <Button>Cancel</Button>*/}
                        {/*    <Button>Ok</Button>*/}
                        {/*</Card.Actions>*/}
                    </Card>
                </View>
             )
        }
    }



export default Following;
