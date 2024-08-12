import { ToastModule } from "primeng/toast";
import { NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ActivationService } from "../../services/activation.service";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-activation",
  standalone: true,
  imports: [NgIf, ToastModule],
  templateUrl: "./activation.component.html",
  providers: [MessageService],
  styleUrl: "./activation.component.scss",
})
export class ActivationComponent implements OnInit {
  token$ = new BehaviorSubject<string>("");
  public isActivated$ = new BehaviorSubject<boolean>(false);
  constructor(
    private readonly activationService: ActivationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    // this.token = this.activatedRoute.snapshot.params['t'] || '';
    this.token$.next(this.activatedRoute.snapshot.queryParams["t"] || "");
    this.onActivate();
  }

  // TODO : reconfig for API INtegration. mismatch model BE and FE
  onActivate() {
    this.activationService.activate(this.token$.value).subscribe({
      next: (response) => {
        if (response.status?.code === 200) {
          this.isActivated$.next(true);
        } else {
          this.isActivated$.next(false);
          this.messageService.add({
            severity: "warn",
            summary: "Warn",
            detail: "Failed decode activation code",
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: "warn",
          summary: "Warn",
          detail: err.error.responseMessage,
        });
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
