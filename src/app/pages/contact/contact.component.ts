import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  constructor(private http: HttpClient) {}

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value;
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    // Send to Netlify function
    this.http.post('/.netlify/functions/sendEmail', {
      name,
      email,
      message
    }).subscribe({
      next: () => {
        alert('Your message sent. We will contact you soon');
        form.reset();
      },
      error: (err) => {
        alert('There was an error sending your message. We will fix it soon.');
        console.error('Send message error:', err);
      }
    });
  }
}
