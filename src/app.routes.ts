import { Routes } from '@angular/router';
import { SecondMainPageComponent } from './component/zoomin/second-main-page/second-main-page.component';
import { MainPageComponent } from './component/zoomin/main-page/main-page.component';
import { WebolutionComponent } from './component/webolution/webolution.component';
import { R8proComponent } from './component/r8pro/r8pro.component';
import { R8proServiceComponent } from './component/r8pro/r8pro-service/r8pro-service.component';
import { R8proBlogComponent } from './component/r8pro/r8pro-blog/r8pro-blog.component';
import { R8proBlogCategoryComponent } from './component/r8pro/r8pro-blog-category/r8pro-blog-category.component';
import { OmniaComponent } from './component/omnia/omnia.component';
import { TOTXTComponent } from './component/totxt/totxt.component';
import { LoginComponent } from './component/totxt/login/login.component';
import { RegistrationComponent } from './component/totxt/registration/registration.component';
import { EmailConfirmationComponent } from './component/totxt/email-confirmation/email-confirmation.component';
import { DashboredComponent } from './component/totxt/dashbored/dashbored.component';
import { HiRemiComponent } from './component/hi-remi/hi-remi.component';
import { LeanAcademyComponent } from './component/lean-academy/lean-academy.component';
import { LeanAcademyCourseComponent } from './component/lean-academy/Courses/lean-academy-course.component';
import { LeanAcademyPagesComponent } from './component/lean-academy/Pages/lean-academy-pages.component';
import { MaviHostComponent } from './component/mavi-host/mavi-host.component';
import { MaviDomainComponent } from './component/mavi-host/mavi-domain/mavi-domain.component';
import { MaviServerComponent } from './component/mavi-host/mavi-server/mavi-server.component';
import { DesignComponent } from './component/design/design.component';
import { PortfolioComponent } from './component/portfolio/portfolio-homePage/portfolio.component';
import { PortfolioContactComponent } from './component/portfolio/portfolio-contact/portfolio-contact.component';
import { PortfolioAboutMeComponent } from './component/portfolio/portfolio-about-me/portfolio-about-me.component';
import { TaskComponent } from './component/task/task.component';
import { TaskDashbordComponent } from './component/task/dashbord/dashbord.component';
import { CreateComponent } from './component/task/create/create.component';
import { TestimonialsComponent } from './component/task/testimonials/testimonials.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'zoomin', component: MainPageComponent },
  { path: 'zoomin/second', component: SecondMainPageComponent },
  { path: 'webolution', component: WebolutionComponent },
  { path: 'r8pro', component: R8proComponent },
  { path: 'r8pro-service', component: R8proServiceComponent },
  { path: 'r8pro-blog', component: R8proBlogComponent },
  { path: 'r8pro-blog-category', component: R8proBlogCategoryComponent },
  { path: 'omnia-page', component: OmniaComponent },
  { path: 'totxt', component: TOTXTComponent },
  { path: 'totxt/login', component: LoginComponent },
  { path: 'totxt/register', component: RegistrationComponent },
  { path: 'totxt/email-confirmation', component: EmailConfirmationComponent },
  { path: 'totxt/dashbored', component: DashboredComponent },
  { path: 'hi-remi', component: HiRemiComponent },
  { path: 'lean-academy', component: LeanAcademyComponent },
  { path: 'lean-academy-course', component: LeanAcademyCourseComponent },
  { path: 'lean-academy-pages', component: LeanAcademyPagesComponent },
  { path: 'mavi-host', component: MaviHostComponent },
  { path: 'mavi-domain', component: MaviDomainComponent },
  { path: 'mavi-server', component: MaviServerComponent },
  { path: 'design', component: DesignComponent },
  { path: 'portfolio-homepage', component: PortfolioComponent },
  { path: 'portfolio-contact', component: PortfolioContactComponent },
  { path: 'portfolio-about-me', component: PortfolioAboutMeComponent },
  { path: 'task', component: TaskComponent },
  { path: 'task/dashbord', component: TaskDashbordComponent },
  { path: 'task/create', component: CreateComponent },
  { path: 'task/testimonials', component: TestimonialsComponent },
  {
    path: 'task/dashbord',
    component: DashboredComponent,
    canActivate: [authGuard],
  },
];
