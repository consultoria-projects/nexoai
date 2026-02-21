import { AvailabilityConfig } from './availability-config';

export interface AvailabilityRepository {
    /**
     * Get the global availability configuration.
     * Should create and return default config if it doesn't exist yet.
     */
    getConfig(): Promise<AvailabilityConfig>;

    /**
     * Save the availability configuration.
     */
    save(config: AvailabilityConfig): Promise<void>;
}
