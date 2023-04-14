import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../services/task.service";
import {Observable} from "rxjs";
import {Task} from "../task/task";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  todo: Observable<Task[]> = this.taskService.getTasks('todo');
  inProgress: Observable<Task[]> = this.taskService.getTasks('inProgress');
  done: Observable<Task[]> = this.taskService.getTasks('done');

  constructor(public taskService: TaskService) {
  }

  ngOnInit(): void {
  }
}
