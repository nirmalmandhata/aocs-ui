import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" [class.hidden]="!isLoading">
      <div class="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center space-y-4">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        </div>
        <p class="text-gray-700 font-medium text-lg">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = 'Processing...';
}
