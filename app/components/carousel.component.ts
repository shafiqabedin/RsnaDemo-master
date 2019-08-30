/**
 * CarouselComponent - class that deals with managing carousel
 *
 * Copyright (c) 2016, acme and/or its affiliates. All rights reserved.
 *
 * @author Shafiq Abedin (sabedin@us.acme.com)
 * @version 1.0
 * @since 2016-9-1
 */

import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'ng2-bootstrap/components/carousel';
import { ModalModule } from 'ng2-bootstrap/components/modal';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { CarouselService } from '../services/carousel.service';
import { QuestionDataModel } from '../models/question-data-model';
import { Subscription } from 'rxjs/Subscription';
import { QuestionService } from '../services/question.service';
import { LoginService } from '../services/login.service';
import { UserDataModel } from '../models/user-data-model';

@Component({
  moduleId: module.id,
  selector: 'my-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['/css/carousel.component.css'],
  providers: [CarouselService]
})

export class CarouselComponent implements OnInit, OnDestroy {

  // Vars
  private myInterval: number = 10000;
  private noWrapSlides: boolean = false;
  private questions: QuestionDataModel[] = [];
  private selectedQuestion: QuestionDataModel = new QuestionDataModel();
  private questionsSubscription: Subscription;
  private selectedQuestionSubscription: Subscription;
  private user: UserDataModel = new UserDataModel();
  private userSubscription: Subscription;
  private showLoginErrorMsg: boolean = false;

  /**
   * ViewChild
   */
  @ViewChild('childModal') public childModal: ModalDirective;

  /**
   * Constructor
   */
  public constructor(
    private router: Router,
    private carouselService: CarouselService,
    private questionService: QuestionService,
    private loginService: LoginService,
    private changeDetectorRef: ChangeDetectorRef
  ) {

    //Question Subscription
    this.questionsSubscription = carouselService.questions$.subscribe(
      data => {
        //Update questions 
        this.questions = data;
        //Took 2 days to figure out :) - pay attention to this and how to update data to dom
        this.changeDetectorRef.detectChanges();
      });

    //Question Subscription
    this.selectedQuestionSubscription = questionService.question$.subscribe(
      data => {
        //Update questions 
        this.selectedQuestion = data;
      });

    //User Subscription
    this.userSubscription = loginService.user$.subscribe(
      data => {
        //Update user
        this.user = data;
        console.log("Updating USER:" + JSON.stringify(this.user));
        console.log("Running checkUserStatus...");
        this.checkUserStatus();
      });
  }

  /**
   * Init
   */
  ngOnInit(): void {
    this.carouselService.getQuestions();
    this.user = this.loginService.getUser();
    console.log("init USER:" + JSON.stringify(this.user));
  }

  /**
   * ngOnDestroy
   */
  ngOnDestroy() {
    this.questionsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  /**
   * Method check if the user exists - then updates the user in login service,
   * will show error message on top of modal if not authenicated
   */
  authenticate(inputUsername, inputPassword) {
    let user: UserDataModel = new UserDataModel();
    user.username = inputUsername;
    user.password = inputPassword;
    this.loginService.authenticate(user);
    if (this.user.authenticated == true) {
      this.showLoginErrorMsg = false; 
    } else (this.user.authenticated == false) {
      setTimeout(()=>{ 
                     return this.showLoginErrorMsg = true; 
            },3000); 
      
    }
  }

  /**
   * Comments!
   */
  public checkUserStatus(): void {

    //Check the user login status 
    if (this.user.authenticated == false) {
      this.showChildModal();
    } else if (this.user.authenticated == true) {
      this.showLoginErrorMsg = false;
      this.hideChildModal();
      this.routeClick();
    }
  }

  /**
   * Sets the selectedQuestion
   */
  public selectQuestion(question: QuestionDataModel): void {

    //Set the question 
    this.questionService.setQuestion(question);
  }

  /**
   * Comments!
   */
  public showChildModal(): void {
    this.childModal.show();
  }

  /**
  * Comments!
  */
  public hideChildModal(): void {
    this.childModal.hide();
  }

  /**
   * Comments!
   */
  public routeClick() {
    if(this.selectedQuestion.specialty === "BREAST"){
      this.router.navigate(['/breast']);
    } else if(this.selectedQuestion.specialty === "CARDIAC"){
      this.router.navigate(['/cardiac']);
    } else {
      this.router.navigate(['/carousel']);
    }
    
  }

  sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
