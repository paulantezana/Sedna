export default class Button {
    constructor({ text = 'Click me', onClick }) {
      this.text = text;
      this.onClick = onClick;
    }
  
    render() {
      const button = document.createElement('button');
      button.className = 'btn';
      button.textContent = this.text;
  
      if (this.onClick) {
        button.addEventListener('click', this.onClick);
      }
  
      return button;
    }
  }
  