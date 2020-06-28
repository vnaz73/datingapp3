import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessageComponent implements OnInit {
@Input() recipientId: number;
messages: Message[];
newMessage: any = {};

  constructor(private authService: AuthService,
              private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .subscribe(messages => {
        this.messages = messages;
      }, error => this.alertify.error(error));
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
    .subscribe((message: Message) => {
      // debugger;
      const user: User = JSON.parse(localStorage.getItem('user'));
      message.senderKnownAs = user.knownAs;
      message.senderPhotoUrl = user.photoUrl;
      this.messages.unshift(message);
      this.newMessage.content = '';
    });
  }
}
