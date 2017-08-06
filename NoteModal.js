import React from 'react';
import {Text, Platform, Modal, View, TextInput} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Segment,
} from 'native-base';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import Markdown from 'react-native-simple-markdown';
import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs;

export default class NoteModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            fileName: this.props.fileName,
            text: this.props.content,
            height: 0,
            isLeftSegmentActive: true,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            fileName: props.fileName,
            text: props.content,
        });
    }

    onChangeText(e) {
        const text = e.nativeEvent.text;
        this.setState({
            text: text,
            height: e.nativeEvent.contentSize.height,
        });
        const dirs = RNFetchBlob.fs.dirs;
        fs.createFile(`${dirs.DocumentDir}/Boostnote/${this.state.fileName}`, text, 'utf8');

    };

    getNoteComponent() {
        if (this.state.isLeftSegmentActive) {
            return <KeyboardAwareScrollView>
                <View>
                    <TextInput
                        style={{
                            margin: 8,
                            height: Math.max(35, this.state.height),
                            borderBottomColor: 'gray',
                            borderBottomWidth: 1
                        }}
                        onChange={(e) => this.onChangeText(e)}
                        value={this.state.text}
                        multiline={true}/>
                </View>
            </KeyboardAwareScrollView>;
        } else {
            return <Markdown>
                {this.state.text}
            </Markdown>
        }
    }

    render() {
        return (
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.props.isNoteOpen}
                onRequestClose={() => {
                }}>
                <Container>
                    <Header style={Platform.OS === 'android' ? {height: 47} : null}>
                        <Left style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent onPress={() => this.props.setIsOpen('', false)}>
                                <Icon name='close'/>
                            </Button>
                        </Left>
                        <Body style={Platform.OS === 'android' ? {top: 0} : null}>
                        <Segment>
                            <Button onPress={() => {
                                this.setState({isLeftSegmentActive: true});
                            }} first active={this.state.isLeftSegmentActive}><Icon name='create'
                                                                                   style={this.state.isLeftSegmentActive ? {} : {color: 'blue'}}/></Button>
                            <Button onPress={() => {
                                this.setState({isLeftSegmentActive: false});
                            }} last active={!this.state.isLeftSegmentActive}><Icon name='eye'
                                                                                   style={this.state.isLeftSegmentActive ? {color: 'blue'} : {}}/></Button>
                        </Segment>
                        </Body>
                        <Right style={Platform.OS === 'android' ? {top: 0} : null}>
                            <Button transparent>
                                <Icon name='more'/>
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        {this.getNoteComponent()}
                    </Content>
                </Container>
            </Modal>
        );
    };
}