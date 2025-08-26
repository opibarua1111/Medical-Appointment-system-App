import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {
  appointments: any;
  patients: any;
  doctors: any;
  medicines: any;
  total = 0;

  isEdit: boolean = false;
  editId: string = '';
  isDataGridShow = true;
  isBtnCreateShow = true;
  addToGridButtonText: string = "Add to Grid";
  isProcessing = false;
  isProcessingMail = false;
  recordsFiltered: any;
  addNewFormValue: boolean = false;

  pageNo = 1;
  length = '10';
  searchValue = '';
  filterDoctorId = '';
  filterVisitType = '';
  formArray: any = [];
  filteredRecordsShow = false;
  start = 0;
  end = 0;
  recordsTotal = 0;
  totalRows: number = 0;
  totalPage: number = 0;
  pageArray: any = [];

  appointmentForm!: FormGroup;
  prescriptionDetailsForm!: FormGroup;
  prescriptionDetailsData: any = [];
  appointmentModel: any;
  prescriptionDetailsModel: any = []

  constructor(private authService: AuthService,  private fb: FormBuilder, private toastrService: ToastrService) {}

  ngOnInit() {
    this.getAppointments();
    this.CreateAppointmentForm();
  }

  getAppointments() {
    this.authService.getAppointments(this.searchValue, this.filterDoctorId, this.filterVisitType, this.pageNo, this.length).subscribe(res => {
      //console.log(res);
      
      this.appointments = res.data.appointments;
      this.doctors = res.data.doctors;
      this.medicines = res.data.medicines;
      this.patients = res.data.patients;

      this.totalRows = res.data.recordsTotal;
      this.recordsTotal = res.data.recordsTotal;
      this.recordsFiltered = res.data.recordsFiltered;
      this.filteredRecordsShow = (this.recordsTotal != this.recordsFiltered);
      this.totalPage = Math.ceil(this.totalRows / 10);

      this.createPageList();
      this.start = (((this.pageNo * Number(this.length)) - Number(this.length)) + 1);
      this.end = this.pageNo * Number(this.length);
      if (this.end > this.totalRows) {
        this.end = this.totalRows;
      }
      this.isProcessing = false;
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;

    });
  }

  //#region Forms
  CreateAppointmentForm() {
    this.appointmentForm = this.fb.group({
      Id: [null, Validators.nullValidator],
      DoctorId: ['', Validators.required],
      PatientId: ['', Validators.required],
      AppointmentDate: ['', Validators.required],
      VisitType: ['', Validators.nullValidator],
      Notes: ['', Validators.nullValidator],
      Diagnosis: ['', Validators.nullValidator],
    });
  }
  CreateVoucherDetailsForm() {
    return this.prescriptionDetailsForm = this.fb.group({
      Id: [null, Validators.nullValidator],
      MedicineId: ['', Validators.required],
      Dosage: ['', Validators.nullValidator],
      StartDate: [null, Validators.nullValidator],
      EndDate: [null, Validators.nullValidator],
      Notes: ['', Validators.nullValidator],
    });
  }
  //#endregion

  edit(id: any) {
    this.isDataGridShow = false;
    this.isBtnCreateShow = false;
    this.isEdit = true;
    this.editId = id;
    this.getAppointment(id);
  }
  
  getAppointment(id: number) {
    this.authService.getAppointment(id).subscribe(res => {
      var data = res.data
      this.prescriptionDetailsData = JSON.parse(data.PrescriptionDetails);
      //console.log(data);
      
      this.appointmentForm = this.fb.group({
        Id: [data.Id, Validators.nullValidator],
        DoctorId: [data.DoctorId, Validators.required],
        PatientId: [data.PatientId, Validators.required],
        AppointmentDate: [data.AppointmentDate.split('T')[0], Validators.required],
        VisitType: [data.VisitType, Validators.nullValidator],
        Notes: [data.Notes, Validators.nullValidator],
        Diagnosis: [data.Diagnosis, Validators.nullValidator],
      });
      
    }, err => {
      console.log(err);
    }, () => {
      this.isProcessing = false;

    });
  }

  getSerial(index: number): number {
    return (this.pageNo - 1) * Number(this.length) + index + 1;
  }

  lengthChange() {
    this.pageNo = 1;
    //this.pageSize = this.length;
    this.getAppointments();
  }
  searchClick() {
    this.pageNo = 1;
    this.getAppointments();
  }
  EnterSubmit(event: any) {
    if (event.keyCode === 13) {
      this.searchClick();
    }
  }
  
  EditShow() {
    this.isDataGridShow = false;
    this.isBtnCreateShow = false;
  }
  Close() {
    window.location.reload();
    this.isDataGridShow = true;
    this.isBtnCreateShow = true;
  }
  Create() {
    this.CreateAppointmentForm();
    this.isDataGridShow = false;
    this.isBtnCreateShow = false;
  }
  dEdit(data: any) {
    if (data) {
      this.formArray = [];
      this.addNewFormValue = true;
      this.addToGridButtonText = "Update";
      this.formArray.push(
        this.prescriptionDetailsForm = this.fb.group({
          Id: [data.Id, Validators.nullValidator],
          MedicineId: [data.MedicineId.toLowerCase(), Validators.required],
          Dosage: [data?.Dosage, Validators.nullValidator],
          StartDate: [data?.StartDate, Validators.nullValidator],
          EndDate: [data?.EndDate, Validators.nullValidator],
          Notes: [data?.Notes, Validators.nullValidator],
        })
      );

    }
  }
  dRemove(data: any) {
    Swal.fire({
      title: 'Are you sure to delete Medecine:' + '"' + data.MedicineName + '" ' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.prescriptionDetailsData = this.prescriptionDetailsData.filter((x: any) => x.Id != data.Id);
        this.toastrService.warning('', 'Please Save.');
      }
    });
  }
  addDetailsFormModel() {
    this.formArray.push(this.CreateVoucherDetailsForm());
  }
  addToGrid() {
    for (const formGroup of this.formArray) {
      console.log(this.formArray.length);
      const MedicineId = formGroup.get('MedicineId')?.value;
      if (MedicineId == '') {
        this.toastrService.warning('Warning', 'Fillup required field');
        return;
      }
    }
    if (this.addToGridButtonText.toLowerCase() != 'update') {
      this.formArray.push(this.CreateVoucherDetailsForm());
    }
    else {
      for (const formGroup of this.formArray) {
        const Id = formGroup.get('Id')?.value;
        const MedicineId = formGroup.get('MedicineId')?.value;
        const Dosage = formGroup.get('Dosage')?.value;
        const StartDate = formGroup.get('StartDate')?.value;
        const EndDate = formGroup.get('EndDate')?.value;
        const Notes = formGroup.get('Notes')?.value;
        const index = this.prescriptionDetailsData.findIndex((c: any) => c?.Id == Id);
        const MedicineName = this.medicines.find((m: any) => m.id == MedicineId)?.name;
        if (index > -1) {
          this.prescriptionDetailsData[index].MedicineName = MedicineName;
          this.prescriptionDetailsData[index].MedicineId = MedicineId;
          this.prescriptionDetailsData[index].Dosage = Dosage;
          this.prescriptionDetailsData[index].StartDate = StartDate;
          this.prescriptionDetailsData[index].EndDate = EndDate;
          this.prescriptionDetailsData[index].Notes = Notes;
        }
      }
      this.addNewFormValue = false;
      this.formArray = [];
      this.addToGridButtonText = "Add to Grid";
    }
  }

  closeVoucherDetails() {
    this.addNewFormValue = false;
    this.formArray = [];
    this.addToGridButtonText = "Add to Grid";
  }
  removeVoucherDetailsField(index: number) {
    this.formArray = this.formArray.filter((x: any, i: number) => i != index);
  }

  //#region pagination
    pageClick(value: any) {
    if (value != 0) {
      // this.activePage = value;
      this.pageNo = value;
      this.pageArray = [];
      this.isProcessing = true;
      this.getAppointments();
    }
  }
  createPageList() {
    this.pageArray = [];
    this.addPageInPageList("Previous", 0, "");
    if (this.totalPage <= 7) {
      for (let i = 1; i <= this.totalPage; i++) {
        this.addPageInPageList("" + i, i, "");
      }
    }
    else {
      if (this.pageNo < 5) {
        for (let i = 1; i <= 5; i++) {
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + this.totalPage, this.totalPage, "");
      }
      else if (this.pageNo > this.totalPage - 4) {
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for (let i = this.totalPage - 4; i <= this.totalPage; i++) {
          this.addPageInPageList("" + i, i, "");
        }
      }
      else {
        this.addPageInPageList("1", 1, "");
        this.addPageInPageList("...", 0, "disabled");
        for (let i = this.pageNo - 1; i <= this.pageNo + 1; i++) {
          this.addPageInPageList("" + i, i, "");
        }
        this.addPageInPageList("...", 0, "disabled");
        this.addPageInPageList("" + this.totalPage, this.totalPage, "");
      }
    }
    this.addPageInPageList("Next", 0, "");

    this.pageArray[0].value = (this.pageNo <= 1) ? 0 : this.pageNo - 1;
    this.pageArray[0].class = (this.pageNo <= 1) ? "disabled" : "";
    const pi = this.pageArray.findIndex((x: any) => x.value == this.pageNo);
    if (pi > 0) {
      this.pageArray[pi].class = "active";
    }
    const li = this.pageArray.length - 1;
    this.pageArray[li].value = (this.totalPage <= this.pageNo) ? 0 : this.pageNo + 1;
    this.pageArray[li].class = (this.totalPage <= this.pageNo) ? "disabled" : "";
  }
  addPageInPageList(t: any, v: any, c: any) {
    this.pageArray.push({
      title: t,
      value: v,
      class: c
    });
  }
  //#endregion

  saveOrUpdateAppointment() {
    if (this.appointmentForm.valid) {
      this.isProcessing = true;
      this.appointmentModel = Object.assign({}, this.appointmentForm.value);

      this.AddPrescriptionDetailsModel();
      this.appointmentModel.PrescriptionDetails = this.prescriptionDetailsModel;
      if (!this.isEdit) {
        this.authService.createAppointment(this.appointmentModel).subscribe((res: any) => {
          this.toastrService.success('', res.message);
          this.isProcessing = false;
          this.formArray = [];
          this.addToGridButtonText = "Add to Grid";
          this.addNewFormValue = false;
          this.getAppointment(res.data.appointmentId);
          //this.Close();
        }, error => {
          this.isProcessing = false;
          this.toastrService.error('', 'Appointment saved failed.');
          console.log(error);
        });
      }
      else {
        this.authService.updateAppointment(this.appointmentModel).subscribe((res:any) => {
          this.toastrService.success('', res.message);
          this.formArray = [];
          this.addToGridButtonText = "Add to Grid";
          this.addNewFormValue = false;
          this.isProcessing = false;
          this.getAppointment(res.data.appointmentId);
        }, error => {
          this.isProcessing = false;
          this.toastrService.error('', 'Appointment Update failed.');
          console.log(error);
        });
      }
    }
    else {
      this.toastrService.warning('Warning', 'Required field is not filled');
    }
  }

  AddPrescriptionDetailsModel(){
    this.prescriptionDetailsModel = [];
    if (this.prescriptionDetailsData) {
      for (const DetailsData of this.prescriptionDetailsData) {
        this.prescriptionDetailsModel.push(
          {
            Id: DetailsData.id,
            MedicineId: DetailsData.MedicineId,
            Dosage: DetailsData.Dosage,
            StartDate: DetailsData.StartDate,
            EndDate: DetailsData.EndDate,
            Notes: DetailsData.Notes,
          });
      }
      
    }
    if (this.addToGridButtonText.toLowerCase() != 'update') {
      for (const formGroup of this.formArray) {
          const MedicineId = formGroup.get('MedicineId')?.value;
          if (MedicineId == '') {
            this.toastrService.warning('Warning', 'Please select medicine');
            continue;
          }
          const Dosage = formGroup.get('Dosage')?.value;
          const StartDate = formGroup.get('StartDate')?.value;
          const EndDate = formGroup.get('EndDate')?.value;
          const Notes = formGroup.get('Notes')?.value;
          this.prescriptionDetailsModel.push({
            Id: null,
            MedicineId: MedicineId,
            Dosage: Dosage,
            StartDate: StartDate,
            EndDate: EndDate,
            Notes: Notes
          });
      }
    }
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure to delete this appointment:' + '"' + '?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.authService.deleteAppointment(id).subscribe(() => {
          this.toastrService.success('', 'Appointment deleted successfully.');
          this.getAppointments();
        }, error => {
          this.toastrService.error('', 'Appointment delete failed.');
          console.log(error);
        });
      }
    });
  }

  sendPrescriptionMail() {
    this.isProcessingMail = true;
    this.AddPrescriptionDetailsModel();
    if (!this.prescriptionDetailsData) {
      this.isProcessingMail = false;
      this.toastrService.warning('Warning', 'Please add Prescription Details');
      return;
    }
    const appointmentId = this.appointmentForm.get('Id')?.value;
    this.authService.sendPrescriptionMail(appointmentId).subscribe((res: any) => {
      this.isProcessingMail = false;
      this.toastrService.success('', res.message);
      this.getAppointments();
    }, error => {
      this.isProcessingMail = false;
      this.toastrService.error('', 'Send Mail failed.');
      console.log(error);
    });
  }
  
}
