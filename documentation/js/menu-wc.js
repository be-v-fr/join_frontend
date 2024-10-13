'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">join documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AddContactComponent.html" data-type="entity-link" >AddContactComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddTaskComponent.html" data-type="entity-link" >AddTaskComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ArrowBackBtnComponent.html" data-type="entity-link" >ArrowBackBtnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BoardComponent.html" data-type="entity-link" >BoardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CloseBtnComponent.html" data-type="entity-link" >CloseBtnComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactListItemComponent.html" data-type="entity-link" >ContactListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactsComponent.html" data-type="entity-link" >ContactsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailComponent.html" data-type="entity-link" >EmailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GreetingComponent.html" data-type="entity-link" >GreetingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeadlineOtherComponent.html" data-type="entity-link" >HeadlineOtherComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeadlineSloganComponent.html" data-type="entity-link" >HeadlineSloganComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HelpComponent.html" data-type="entity-link" >HelpComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LegalNoticeComponent.html" data-type="entity-link" >LegalNoticeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogInPageComponent.html" data-type="entity-link" >LogInPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MenuComponent.html" data-type="entity-link" >MenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PasswordIconComponent.html" data-type="entity-link" >PasswordIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PersonBadgeComponent.html" data-type="entity-link" >PersonBadgeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrioIconComponent.html" data-type="entity-link" >PrioIconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrivacyPolicyComponent.html" data-type="entity-link" >PrivacyPolicyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegistrationFormComponent.html" data-type="entity-link" >RegistrationFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SlideComponent.html" data-type="entity-link" >SlideComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatsItemComponent.html" data-type="entity-link" >StatsItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubtaskComponent.html" data-type="entity-link" >SubtaskComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SummaryComponent.html" data-type="entity-link" >SummaryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskCardComponent.html" data-type="entity-link" >TaskCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskCategoryComponent.html" data-type="entity-link" >TaskCategoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListComponent.html" data-type="entity-link" >TaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskViewComponent.html" data-type="entity-link" >TaskViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToastNotificationComponent.html" data-type="entity-link" >ToastNotificationComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppUser.html" data-type="entity-link" >AppUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUser.html" data-type="entity-link" >AuthUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Contact.html" data-type="entity-link" >Contact</a>
                            </li>
                            <li class="link">
                                <a href="classes/Subtask.html" data-type="entity-link" >Subtask</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link" >Task</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AutoscrollService.html" data-type="entity-link" >AutoscrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContactsService.html" data-type="entity-link" >ContactsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasksService.html" data-type="entity-link" >TasksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});