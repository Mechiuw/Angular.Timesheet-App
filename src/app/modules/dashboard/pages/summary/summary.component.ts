import { Component, OnInit } from "@angular/core";
import { ChartModule } from "primeng/chart";
import { NftHeaderComponent } from "../../../approval/components/nft/nft-header/nft-header.component";
import { TimesheetTableComponent } from "../../../approval/components/timesheet-table/timesheet-table.component";
import { TimesheetSummary } from "../../../approval/model/timesheet";
import { SummaryTableComponent } from "../../components/summary/summary-table/summary-table.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-summary",
  standalone: true,
  imports: [RouterLink, NftHeaderComponent, ChartModule, TimesheetTableComponent, SummaryTableComponent],
  templateUrl: "./summary.component.html",
  styleUrl: "./summary.component.scss",
})
export class SummaryComponent implements OnInit {
  title = "Dashboard";
  subtitle = "Timesheet Summary";

  pieData: any;
  pieOptions: any;

  lineData: any;
  lineOptions: any;

  total: number = 540 + 325 + 702;

  // Example Timesheet
  timesheets: TimesheetSummary[] = [];

  // Data Role
  role: string = "admin";

  // Data Loading
  isLoading: boolean = true;

  // Generate Data
  generateDummyData() {
    this.timesheets = [
      {
        id: "entry1",
        user: "user1",
        status: "pending", // Updated status
        totalFee: 3500,
        createdAt: new Date("2024-08-01T10:00:00Z"),
        updatedAt: new Date("2024-08-01T12:00:00Z"),
        deletedAt: undefined,
       
      },
      {
        id: "entry2",
        user: "user2",
        status: "approved", // Updated status
        totalFee: 1700,
        createdAt: new Date("2024-08-02T11:00:00Z"),
        updatedAt: new Date("2024-08-02T13:00:00Z"),
        deletedAt: new Date("2024-08-03T14:00:00Z"),
        
      },
      {
        id: "entry3",
        user: "user3",
        status: "settlement", // Updated status
        totalFee: 1800,
        createdAt: new Date("2024-08-03T09:00:00Z"),
        updatedAt: new Date("2024-08-03T10:00:00Z"),
        deletedAt: undefined,
        
      },
    ];
  }

  ngOnInit() {
    const pieDocumentStyle = getComputedStyle(document.documentElement);
    const pieTextColor = pieDocumentStyle.getPropertyValue("--text-color");

    this.pieData = {
      labels: ["Diterima", "Ditolak", "Ongoing"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [
            pieDocumentStyle.getPropertyValue("--green-500"),
            pieDocumentStyle.getPropertyValue("--red-500"),
            pieDocumentStyle.getPropertyValue("--blue-500"),
          ],
          hoverBackgroundColor: [
            pieDocumentStyle.getPropertyValue("--green-400"),
            pieDocumentStyle.getPropertyValue("--red-400"),
            pieDocumentStyle.getPropertyValue("--blue-400"),
          ],
        },
      ],
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: pieTextColor,
          },
        },
      },
    };

    const lineDocumentStyle = getComputedStyle(document.documentElement);
    const lineTextColor = lineDocumentStyle.getPropertyValue("--text-color");
    const lineTextColorSecondary = lineDocumentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const lineSurfaceBorder =
      lineDocumentStyle.getPropertyValue("--surface-border");

    this.lineData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: lineDocumentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
        {
          label: "Second Dataset",
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: lineDocumentStyle.getPropertyValue("--pink-500"),
          tension: 0.4,
        },
      ],
    };

    this.lineOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: lineTextColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: lineTextColorSecondary,
          },
          grid: {
            color: lineSurfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: lineTextColorSecondary,
          },
          grid: {
            color: lineSurfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    // Dummy Loading
    setTimeout(() => {
      this.isLoading = false;
      this.generateDummyData();
    }, 3000);
  }
}
