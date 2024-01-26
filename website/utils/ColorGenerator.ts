
const DefaultRandomColors: string[] = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#1abc9c'];

export class ColorGenerator {
    private baselineColors: string[];
    private colorGenerated: number = 0;

    constructor(baselineColors: string[] = DefaultRandomColors) {
        this.baselineColors = baselineColors;
    }

    private getRandomColor(): string {
        const letters: string = '0123456789ABCDEF';
        let color: string = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateColor(): string {
        const generatedColors: string[] = [];

        // Use baseline colors if not exceeding the maximum length
        if (this.colorGenerated < this.baselineColors.length) {
            const newColor = this.baselineColors[this.colorGenerated];
            this.colorGenerated++;
            return newColor;
        }

        return this.getRandomColor();
    }
}
