import * as THREE from "three";
import type { MoveDirection } from "../types";
import { endsUpInValidPosition } from "../utilities/endsUpInValidPosition";
import { metadata as rows, addRows } from "./Map";

export const player = Player();

function Player() {
    const player = new THREE.Group();
  
    // Cuerpo
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(10, 15, 20),
      new THREE.MeshLambertMaterial({ color: "white", flatShading: true })
    );
    body.position.z = 10;
    body.castShadow = true;
    body.receiveShadow = true;
    player.add(body);
  
    // Cabeza
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(8, 8, 8),
      new THREE.MeshLambertMaterial({ color: 0xffcc99, flatShading: true })
    );
    head.position.z = 26;
    head.castShadow = true;
    head.receiveShadow = true;
    player.add(head);
  
    // Gorra
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 2),
      new THREE.MeshLambertMaterial({ color: 0xf0619a, flatShading: true })
    );
    cap.position.z = 30;
    cap.castShadow = true;
    cap.receiveShadow = true;
    player.add(cap);
  
    const capBrim = new THREE.Mesh(
      new THREE.BoxGeometry(10, 4, 1),
      new THREE.MeshLambertMaterial({ color: 0xf0619a, flatShading: true })
    );
    capBrim.position.set(0, -5, 30);
    capBrim.castShadow = true;
    capBrim.receiveShadow = true;
    player.add(capBrim);
  
    // Brazos
    const armMaterial = new THREE.MeshLambertMaterial({ color: "white", flatShading: true });
    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 12), armMaterial);
    leftArm.position.set(-8, 0, 15);
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    player.add(leftArm);
  
    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 12), armMaterial);
    rightArm.position.set(8, 0, 15);
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    player.add(rightArm);
  
    // Piernas
    const legMaterial = new THREE.MeshLambertMaterial({ color: "blue", flatShading: true });
    const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 14), legMaterial);
    leftLeg.position.set(-4, 0, -2);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    player.add(leftLeg);
  
    const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 14), legMaterial);
    rightLeg.position.set(4, 0, -2);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    player.add(rightLeg);
  
    // Contenedor del jugador
    const playerContainer = new THREE.Group();
    playerContainer.add(player);
  
    return playerContainer;
  }

export const position: {
    currentRow: number;
    currentTile: number;
  } = {
    currentRow: 0,
    currentTile: 0,
  };
  
  export const movesQueue: MoveDirection[] = [];

  export function initializePlayer() {
    // Initialize the Three.js player object
    player.position.x = 0;
    player.position.y = 0;
    player.children[0].position.z = 0;
  
    // Initialize metadata
    position.currentRow = 0;
    position.currentTile = 0;
  
    // Clear the moves queue
    movesQueue.length = 0;
  }
  
  export function queueMove(direction: MoveDirection) {
    const isValidMove = endsUpInValidPosition(
      {
        rowIndex: position.currentRow,
        tileIndex: position.currentTile,
      },
      [...movesQueue, direction]
    );
  
    if (!isValidMove) return;
  
    movesQueue.push(direction);
  }
  
  export function stepCompleted() {
    const direction = movesQueue.shift();
  
    if (direction === "forward") position.currentRow += 1;
    if (direction === "backward") position.currentRow -= 1;
    if (direction === "left") position.currentTile -= 1;
    if (direction === "right") position.currentTile += 1;

    // Add new rows if the player is running out of them
    if (position.currentRow > rows.length - 10) addRows();

    const scoreDOM = document.getElementById("score");
    if (scoreDOM) scoreDOM.innerText = position.currentRow.toString();
  }