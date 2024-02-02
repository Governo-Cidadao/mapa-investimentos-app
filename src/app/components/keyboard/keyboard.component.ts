import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Map } from 'leaflet';
import Keyboard from 'simple-keyboard';
import SimpleKeyboardLayouts from 'simple-keyboard-layouts';
import { LayoutItem, LayoutItemObj } from 'simple-keyboard-layouts/build/interfaces';
import { MapService } from '../../service/map.service';


@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrl: './keyboard.component.css'
})
export class KeyboardComponent implements AfterViewInit, OnInit {
  map!: Map | null;
  keyboard!: Keyboard;
  layout!: LayoutItem | LayoutItemObj;
  isKeyboardVisible: boolean = true;
  value = "";

  constructor(private mapService: MapService){}

  ngOnInit(): void {
    this.mapService.map$.subscribe((map) => {
      this.map = map;
    });
  }

  ngAfterViewInit() {
    this.layout = new SimpleKeyboardLayouts().get("brazilian");
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      ...this.layout
    });
  }

  onChange = (input: string) => {
    this.value = input;
  };

  onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };
}
