
export class ConfigurationManager<T> {
    private defaultConfiguration: T;
    private currentConfiguraiton: T;

    private configurations: Partial<T>[] = [];

    constructor(configuraiton: T) {
        this.defaultConfiguration = configuraiton;
        this.currentConfiguraiton = configuraiton;
    }

    public reset() {
        this.configurations = [];
        this.updateCurrentConfiguration();
    }

    // Insert at the beginning of the linked list
    public addConfiguration(data: Partial<T>): () => void {
        this.configurations.push(data)
        this.updateCurrentConfiguration();

        return () => {
            this.configurations = this.configurations.filter(x => x != data);
            this.updateCurrentConfiguration();
        }
    }

    // Get the current configuration
    public getCurrentConfiguration(): T {
        return this.currentConfiguraiton;
    }

    private updateCurrentConfiguration() {
        this.currentConfiguraiton = { ...this.defaultConfiguration };

        for (const configuraiton of this.configurations) {
            this.currentConfiguraiton = { ...this.currentConfiguraiton, ...configuraiton }
        }
    }
}
