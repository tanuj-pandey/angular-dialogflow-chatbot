import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { WithBreadcrumbDashboardComponent } from './with-breadcrumb/with-breadcrumb-dashboard.component';
import { AgentComponent } from './agent/agent.component';


const routes: Routes = [
  {
    path: 'default',
    component: AgentComponent,
    data: {
      title: 'Dashboard ',
      headerDisplay: "none"
    }
  },
  {
    path: 'with-breadcrumb',
    component: WithBreadcrumbDashboardComponent,
    data: {
      title: 'With Breadcrumb '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
