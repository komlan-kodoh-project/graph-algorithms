
const DefaultRandomColors: string[] = ['#94a3b8', '#ef4444', '#f43f5e', '#6366f1', '#0ea5e9', '#65a30d', '#0d9488'];

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
