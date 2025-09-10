import * as THREE from 'https://cdn.skypack.dev/three@0.155.0';
import { GLTFExporter } from 'https://cdn.skypack.dev/three/examples/jsm/exporters/GLTFExporter.js';

export default class CharacterManager {
    constructor(scene) {
        this.scene = scene;
        this.characterGroup = new THREE.Group();
        this.scene.add(this.characterGroup);
        this.parts = {};

        // Define available 3D assets (geometries and materials)
        this.assets = {
            geometries: {
                body: new THREE.CylinderGeometry(0.1, 0.4, 1.5, 32),
                head: new THREE.SphereGeometry(0.3, 32, 16),
                hair: {
                    short: new THREE.SphereGeometry(0.35, 16, 8),
                    long: new THREE.ConeGeometry(0.4, 1.0, 16),
                },
                corse: new THREE.BoxGeometry(0.9, 0.8, 0.5),
                gloves: new THREE.BoxGeometry(0.25, 0.25, 0.25),
                boots: new THREE.BoxGeometry(0.3, 0.4, 0.3),
                skirt: new THREE.CylinderGeometry(0.5, 0.7, 0.6, 16),
            },
            materials: {
                skin: new THREE.MeshStandardMaterial({ color: 0xad7258, roughness: 0.8 }),
                hair: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 }),
                armor: {
                    plate: new THREE.MeshStandardMaterial({ color: 0xsilver, metalness: 0.9, roughness: 0.2 }),
                    leather: new THREE.MeshStandardMaterial({ color: 0x5c3d20, roughness: 0.7 }),
                }
            }
        };
    }

    // Defines the structure of the UI
    getOptions() {
        return {
            'Hair': ['short', 'long'],
            'Armor': ['plate', 'leather'],
            'Gear': ['corse', 'gloves', 'boots', 'skirt'], // These are toggles
        };
    }

    build(config) {
        // Clear previous character
        this.characterGroup.clear();
        this.parts = {};

        const { geometries: geo, materials: mat } = this.assets;
        const armorMat = mat.armor[config.Armor];

        // --- ADD STATIC PARTS ---
        this._addPart('body', geo.body, mat.skin, { y: 0.75 });
        this._addPart('head', geo.head, mat.skin, { y: 1.7 });
        
        // --- ADD CONFIGURABLE PARTS ---
        // Hair Style
        this._addPart('hair', geo.hair[config.Hair], mat.hair, { y: 1.8 });

        // Gear Toggles
        for (const gearPart of this.getOptions()['Gear']) {
            if (config[gearPart]) { // Check if the toggle is true
                this._addPart(gearPart, geo[gearPart], armorMat);
            }
        }
    }
    
    // Helper to create and position mesh parts
    _addPart(name, geometry, material, position = {}) {
        const mesh = new THREE.Mesh(geometry, material);
        
        // Default positions
        const defaultPositions = {
            corse: { y: 1.0 },
            gloves: { x: 0.6, y: 0.8 },
            boots: { y: 0.2 },
            skirt: { y: 0.4 },
        };

        mesh.position.set(
            position.x || defaultPositions[name]?.x || 0,
            position.y || defaultPositions[name]?.y || 0,
            position.z || defaultPositions[name]?.z || 0
        );
        
        this.parts[name] = mesh;
        this.characterGroup.add(mesh);
    }
    
    exportGLB() {
        new GLTFExporter().parse(this.characterGroup, (glb) => {
            const blob = new Blob([glb], { type: 'model/gltf-binary' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'character.glb';
            link.click();
        }, (err) => console.error(err), { binary: true });
    }
}
