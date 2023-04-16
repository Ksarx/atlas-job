import { Component, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { IFilter } from 'src/app/models/filter';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {
  disabled: boolean;
  selectedValues: any;
  selectAll = false;
  @Input() optionItems: IFilter[];
  @ViewChild('combo', { static: true }) combo: any;
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {}

  toggleCheckAll(values: any) {
    if (values.currentTarget.checked) {
      this.selectAllItems();
    } else {
      this.unselectAllItems();
    }
  }
  onChange(event: any) {
    debugger;
  }

  onTouched() {}

  onSelectionChange(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
      const newList = selectedItems.map((x) => x.id);
      this.selectedValues = [...newList];
      this.selectAll = this.optionItems.length === this.selectedValues.length;
      this.onChange([...newList]);
    }
    this.onTouched();
  }

  writeValue(obj: any): void {
    this.selectedValues = [...obj];
    this.selectAll = this.selectedValues.length === obj.length;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private selectAllItems() {
    const newList = this.optionItems.map((x) => x.id);
    this.selectedValues = [...newList];
    this.onChange([...newList]);
  }

  private unselectAllItems() {
    this.selectedValues = [];
    this.onChange([]);
  }
}
