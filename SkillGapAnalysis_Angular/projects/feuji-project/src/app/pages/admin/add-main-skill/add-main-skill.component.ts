import { Component, OnInit } from '@angular/core';
import { EmployeeSkillService } from '../../../services/employee-skill.service';
import { MatDialog } from '@angular/material/dialog';
import { AddSkillCategoryComponent } from '../add-skill-category/add-skill-category.component';
import { AddSubSkillCategoryComponent } from '../add-sub-skill-category/add-sub-skill-category.component';
import { SubSkillData } from '../../../../models/SubSkillData.service';
import { SkillDisplayComponent } from '../../skillgap/skill-display/skill-display.component';
import { SkillData } from '../../../../models/SkillData.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-main-skill',
  templateUrl: './add-main-skill.component.html',
  styleUrls: ['./add-main-skill.component.css'], 
})
export class AddMainSkillComponent implements OnInit {
  accordionData: any[] = []; // Initialize with  skill categories data structure
  accordionSubData: any[] = []; // Initialize with  sub-skills data structure
  panelOpenState: boolean = false;
  selectedTechCat: any;
  allSkills: any[]=[];
  selectedSubItem:any;
  size:number=0;
  selectedStatus:number=0;
  selectedSkillId:number=0;
  // originalData: any[] = [];
  changesToSave: any[] = [];
  constructor(private employeeSkillService: EmployeeSkillService,public dialog: MatDialog,private subSkillDataSevice: SubSkillData,private skillDataSevice: SkillData) {
    
  }
  ngOnInit(): void {
  // Load initial skill categories data
  this.loadSkillCategories();
  }

  loadSkillCategories() {
    this.employeeSkillService.getSkillCategoryNames().subscribe((data: any[]) => {
      this.accordionData = data;
      console.log('Skill Categories Data:', this.accordionData);
    });
  }

  onSelectSkillCategory(selectedSkillCategory: any) {
   
    console.log('Selected Skill Category:', selectedSkillCategory);
    this.employeeSkillService.getTechnicalCategory(selectedSkillCategory).subscribe((subSkills: any[]) => {
      this.accordionSubData = subSkills;
      console.log('Sub-skills Data:', this.accordionSubData);
      this.subSkillDataSevice.updateAccordionSubData(subSkills);
    });
  }
  onSelectTechCat(techCat:any){
    this.size=0;
    this.selectedSubItem = this.accordionSubData.find(item => item.referenceDetailId === techCat);
    
    this.employeeSkillService.getSkills(techCat).subscribe((skills: any[])=>{      
        this.allSkills = skills;
        console.log(this.allSkills)
        
      this.skillDataSevice.updateAccordionSubData(skills);
      this.calculateSize();
    },
    (error) => {
      console.error(error);
    }
    )
  }
  onSelectSkill(skillId:any) 
  {
    this.selectedSkillId=skillId
    console.log(this.selectedSkillId);
    
  }
  calculateSize() {
    this.size = this.allSkills.length;
  }



    addNewRow(): void {
      const dialogRef = this.dialog.open(AddSkillCategoryComponent, {
       
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        
      });


      
    }


    addNewSubSkill(): void {
      const dialogRef = this.dialog.open(AddSubSkillCategoryComponent, {
        panelClass: 'dialog-background'
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // Handle any actions after the dialog is closed
      });
    }

    addNewSkill(): void {
      const dialogRef = this.dialog.open(SkillDisplayComponent, {
        panelClass: 'dialog-background'
        
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    deleteSkill():void{
      
    }

    addNewCategory(addingNewCategory: any)
  {
    // console.log('Selected Skill Category:', addingNewCategory);
    // this.employeeSkillService.saveSkillCategoryAdmin(addingNewCategory).subscribe((subSkills: any[]) => {
    //   this.accordionSubData = subSkills;
    //   console.log('Sub-skills Data:', this.accordionSubData);
    // });
  }

updateStatus(item: any) {
  // Add the changed item to the changesToSave array if not already present
  if (!this.changesToSave.includes(item)) {
    this.changesToSave.push(item);
  }
}

saveChanges() {
  if (this.changesToSave.length === 0) {
    Swal.fire("No changes to save");
    return;
  }
  
  // Iterate over the items in changesToSave and update each checkbox status individually
  this.changesToSave.forEach(item => {
    this.employeeSkillService.updateStatusAdmin(item.skillId, item.status ? 1 : 0).subscribe(
      (response: any) => {
        Swal.fire("Status updated successfully");
      },
      (error: any) => {
        console.error("Unable to update status:", error);
        Swal.fire("Unable to update status");
      }
    );
  });

  // After all updates are done, clear the changesToSave array
  this.changesToSave = [];
}


cancelChanges() {
  if (this.changesToSave.length === 0) {
    Swal.fire("Nothing to cancel");
    return;
  }
  // Reset all checkbox statuses to their original values
  this.changesToSave.forEach((item) => {
    item.status = !item.status;
    Swal.fire("Cancel the changes done");
  });
  this.changesToSave = []; // Clear the changesToSave array
}

}
