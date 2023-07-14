import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/shared/interfaces/message.type';
import { AccessTokenSerivce } from 'src/app/shared/services/acccessToken.service';
import { AudioRecordingService } from 'src/app/shared/services/audioRecording.service';
import { DialogflowService } from 'src/app/shared/services/dialogflow.service';
import { SessionService } from 'src/app/shared/services/session.service';

@Component({
    selector: 'agent-quick-chat',
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss']
})
export class AgentComponent {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    messageList: Message[];
    message: String;
    blobSubscription;
    public toggleChat: boolean = false;
    public resizeFlag: boolean = false;

    popopened = 0;


    constructor(
        private dialogflowService: DialogflowService,
        private audioRecordingService: AudioRecordingService,
        private accessTokenService: AccessTokenSerivce,
    ) { }

    ngOnInit() {
        this.messageList = [];
        this.blobSubscription = false;

        this.accessTokenService.generateAccessToken().subscribe(response => {
            console.log(response);
        });
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    public sendMessage(message) {
        if (message.length != 0) {
            this.messageList.push({
                text: message,
                isOwner: true,
                payload: null
            });
            this.message = '';
            this.detectIntent(message);
        }
    }

    private detectIntent(message: string) {
        this.dialogflowService.detectIntent(this.getSessionId(), message).subscribe(response => {
            this.playText(response['outputAudio']);
            this.messageList.push({
                text: response['queryResult']['fulfillmentText'],
                isOwner: false,
                payload: (response['queryResult']['fulfillmentMessages'].length > 1 && response['queryResult']['fulfillmentMessages'][1].payload) ? response['queryResult']['fulfillmentMessages'][1].payload : null
            });
            this.scrollToBottom();

        });
    }

    private playText(encodedAudio) {
        let audio = new Audio("data:audio/wav;base64," + encodedAudio);
        audio.play();
    }

    private getSessionId(): string {
        return SessionService.getSessionToken();
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }


    public startRecording() {
        this.audioRecordingService.startRecording();
    }

    public async stopRecording() {
        this.audioRecordingService.stopRecording();
        this.audioRecordingService.getRecordedBlob().subscribe(response => {
            let reader = new FileReader();
            reader.readAsDataURL(response.blob);
            reader.onloadend = () => {
                let base64 = reader.result.toString().split(',')[1];
                this.detectIntentFromAudio(base64);
            }
        });
    }

    private detectIntentFromAudio(audio) {
        this.blobSubscription = this.dialogflowService.detectIntentFromAudio(this.getSessionId(), audio).subscribe((response) => {
            this.playText(response['outputAudio']);
            this.messageList.push({
                text: response['queryResult']['queryText'],
                isOwner: true,
                payload: null
            });
            this.messageList.push({
                text: response['queryResult']['fulfillmentText'],
                isOwner: false,
                payload: (response['queryResult']['fulfillmentMessages'].length > 1 && response['queryResult']['fulfillmentMessages'][1].payload) ? response['queryResult']['fulfillmentMessages'][1].payload : null
            });
            this.unsubscribe();
        });
    }

    private unsubscribe() {
        this.blobSubscription.unsubscribe();
    }

    public async blobToBase64(blob) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            return reader.result;
        }
    }


    public toggleQuickChat() {
        this.toggleChat = !this.toggleChat;
        if (this.popopened < 1) {
            this.sendMessage('');
            this.popopened++;
        }
    }

    public resizeChatBox() {
        this.resizeFlag = true;
    }

    public minimizeQuickChat() {
        this.toggleChat = false;
        this.resizeFlag = false;
    }


}
