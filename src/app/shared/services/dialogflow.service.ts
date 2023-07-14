import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DialogflowService {

  sessionId: string;
  sessionClient;

  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('accessKey'),
      'Content-Type': 'application/json; charset=utf-8',
    })
  };

  constructor(private httpClient: HttpClient) { }


  public detectIntent(sessionId: string, mesaage: string) {
    const payload = {
      query_input: {
        text: {
          text: mesaage,
          language_code: 'en'
        }
      },
      output_audio_config: {
        audio_encoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        synthesizeSpeechConfig: {
          speakingRate: 1.2,
          voice: {
            ssmlGender: 'SSML_VOICE_GENDER_MALE'
          }
        }
      }
    }

    return this.httpClient.post(
      environment.DF_ENDPOINT + 'agent/sessions/' + sessionId + ':detectIntent',
      payload,
      this.httpOptions
    );
  }

  public detectIntentFromAudio(sessionId: string, audio: string) {
    const payload = {

      queryInput: {
        audioConfig: {
          languageCode: "en"
        }
      },
      inputAudio: audio,
      output_audio_config: {
        audio_encoding: 'OUTPUT_AUDIO_ENCODING_LINEAR_16',
        synthesizeSpeechConfig: {
          speakingRate: 1.2,
          voice: {
            ssmlGender: 'SSML_VOICE_GENDER_MALE'
          }
        }
      }
    }

    return this.httpClient.post(
      environment.DF_ENDPOINT + 'agent/sessions/' + sessionId + ':detectIntent',
      payload,
      this.httpOptions
    );
  }


  public async sendMessageAndGetResponse(sessionId: string, message: string) {
    const responses = await this.sessionClient.detectIntent({
      session: this.getSesssionPath(sessionId),
      queryInput: {
        text: {
          text: message,
          languageCode: 'en',
        },
      },
    });

    return responses[0];
  }

  private getSesssionPath(sessionId: string) {
    return this.sessionClient.sessionPath(environment.DF_PROJECT_ID, sessionId);
  }
}
