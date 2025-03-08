// Asset Loader System
const AssetLoader = {
    assets: {
        images: [
            'assets/images/card-back.jpg',
            ...Array.from({length: 22}, (_, i) => `assets/images/major-arcana/${[
                'fool', 'magician', 'high-priestess', 'empress', 'emperor',
                'hierophant', 'lovers', 'chariot', 'strength', 'hermit',
                'wheel-of-fortune', 'justice', 'hanged-man', 'death',
                'temperance', 'devil', 'tower', 'star', 'moon', 'sun',
                'judgement', 'world'
            ][i]}.jpg`)
        ],
        sounds: [
            'assets/sounds/card-flip.mp3',
            'assets/sounds/card-shuffle.mp3',
            'assets/sounds/ambient-music.mp3'
        ]
    },

    loadedAssets: {
        images: {},
        sounds: {}
    },

    updateLoadingProgress(loaded, total) {
        const progress = Math.round((loaded / total) * 100);
        const loadingProgress = document.getElementById('loading-progress');
        if (loadingProgress) {
            loadingProgress.textContent = `Loading assets: ${progress}%`;
        }
        console.log(`Loading progress: ${progress}%`);
    },

    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.loadedAssets.images[src] = img;
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
    },

    async loadSound(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = src;
            audio.oncanplaythrough = () => {
                this.loadedAssets.sounds[src] = audio;
                resolve(audio);
            };
            audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
        });
    },

    async preloadAll() {
        const totalAssets = this.assets.images.length + this.assets.sounds.length;
        let loadedCount = 0;

        try {
            const imagePromises = this.assets.images.map(async (src) => {
                try {
                    await this.loadImage(src);
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalAssets);
                } catch (error) {
                    console.error(error);
                    // Continue loading other assets even if one fails
                }
            });

            const soundPromises = this.assets.sounds.map(async (src) => {
                try {
                    await this.loadSound(src);
                    loadedCount++;
                    this.updateLoadingProgress(loadedCount, totalAssets);
                } catch (error) {
                    console.error(error);
                    // Continue loading other assets even if one fails
                }
            });

            // Wait for all assets to load
            await Promise.all([...imagePromises, ...soundPromises]);
            console.log('All assets loaded successfully');
            return true;
        } catch (error) {
            console.error('Error during asset preloading:', error);
            return false;
        }
    },

    getLoadedImage(src) {
        return this.loadedAssets.images[src];
    },

    getLoadedSound(src) {
        return this.loadedAssets.sounds[src];
    }
};

// Export for use in other files
window.AssetLoader = AssetLoader; 