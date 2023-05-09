import {AfterContentInit, Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Observable} from "rxjs";
import {Task} from "../task/task";
import {ViewOrderTypes} from "./view.order.types";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  viewOrder: ViewOrderTypes = Object.keys(ViewOrderTypes)[0] as ViewOrderTypes;
  todo: Observable<Task[]> = this.taskService.getTasks('todo', this.viewOrder);
  inProgress: Observable<Task[]> = this.taskService.getTasks('inProgress', this.viewOrder);
  done: Observable<Task[]> = this.taskService.getTasks('done', this.viewOrder);
  viewType: string = 'board';
  viewOrderTypes = ViewOrderTypes;

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
  }

  selectViewOrder($event: MatSelectChange) {
    this.viewOrder = $event.value as ViewOrderTypes;
    this.todo = this.taskService.getTasks('todo', this.viewOrder);
    this.inProgress = this.taskService.getTasks('inProgress', this.viewOrder);
    this.done = this.taskService.getTasks('done', this.viewOrder);
  }

  sortOrder (a: ViewOrderTypes, b: ViewOrderTypes) {
    if (a < b) return -1;
    if (a === b) return 0;
    if (a > b) return 1;
    return 0;
  }
}
