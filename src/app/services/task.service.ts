import {BehaviorSubject, Observable} from "rxjs";
import {Task} from "../components/task/task";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {MatDialog} from "@angular/material/dialog";
import {
  TaskDialogComponent,
  TaskDialogResult
} from "../components/task-dialog/task-dialog.component";
import {CdkDragDrop, transferArrayItem} from "@angular/cdk/drag-drop";
import {AuthService} from "./auth.service";
import {Injectable} from "@angular/core";
import {doc} from "@angular/fire/firestore";
import {ViewOrderTypes} from "../components/dashboard/view.order.types";

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({idField: 'id'}).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore,
    private authService: AuthService
  ) {
  }

  getTasks(list: 'done' | 'todo' | 'inProgress', orderBy: ViewOrderTypes): Observable<Task[]> {
    const user = this.authService.userData;
    if (user) {
      return getObservable(
        this.store.collection<Task>(
          list,
          (ref) => ref.where(
            'userId',
            '==',
            user.uid
          ).orderBy(
              orderBy,
            'asc'
          )
        )
      );
    }

    return getObservable(this.store.collection<Task>(list, (ref) =>
        ref.orderBy(
          orderBy,
        'asc'
        )
      )
    );
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '300px',
      data: {
        task: {
          userId: this.authService.userData.uid,
          createdAt: new Date(),
        },
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        result.task.insensitiveTitle = result.task.title?.toLowerCase();
        this.store.collection('todo').add(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (result: TaskDialogResult) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        await this.store.collection<Task>(list).doc(task.id).delete();
      } else {
        result.task.insensitiveTitle = result.task.title?.toLowerCase();
        await this.store.collection<Task>(list).doc(task.id).update(task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      return Promise.all([
        this.store.collection<Task>(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection<Task>(event.container.id).add(item),
      ]);
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
