import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  onSubmit(e: Event) {
    e.preventDefault();
    // placeholder: wire to backend in production
    alert('Sample form submission — wire to backend.');
  }
}
