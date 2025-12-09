---
sidebar_label: "Lesson 1.3: Implementing Your First Physical AI System"
sidebar_position: 3
---

# Lesson 1.3: Implementing Your First Physical AI System

## Learning Objectives
- Set up a basic Physical AI environment
- Implement a simple Physical AI system
- Bridge the gap between AI algorithms and physical behaviors
- Test and validate the implemented system

## Introduction

In this lesson, we'll implement our first simple Physical AI system. We'll build a basic physics simulation with an AI controller that demonstrates how to bridge the gap between abstract AI algorithms and physical behaviors.

## Prerequisites

Before starting, ensure you have installed:
- Python 3.8 or higher
- NumPy: `pip install numpy`
- Matplotlib: `pip install matplotlib`

## System Overview

Our Physical AI system will be a simple cart-pole system (also known as the inverted pendulum). The AI controller's goal is to balance the pole by applying forces to the cart.

### Mathematical Model

The cart-pole system can be modeled using the Lagrangian mechanics approach. The system has two degrees of freedom: the horizontal position of the cart ($x$) and the angle of the pole ($\theta$).

The Lagrangian $L$ is defined as the difference between kinetic energy $T$ and potential energy $V$:

$$ L = T - V $$

The kinetic energy of the system is:

$$ T = \frac{1}{2}(m_c + m_p)\dot{x}^2 + \frac{1}{2}I\dot{\theta}^2 + m_p\dot{x}l\dot{\theta}\cos\theta + \frac{1}{2}m_pl^2\dot{\theta}^2 $$

The potential energy is:

$$ V = m_pgl\cos\theta $$

Using the Euler-Lagrange equations, we can derive the equations of motion for the system.

## Implementation

Let's start by implementing the physics simulation:

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

class CartPole:
    def __init__(self, length=1.0, mass_cart=1.0, mass_pole=0.1, gravity=9.81):
        self.length = length          # Length of the pole
        self.mass_cart = mass_cart    # Mass of the cart (kg)
        self.mass_pole = mass_pole    # Mass of the pole (kg)
        self.gravity = gravity        # Gravity (m/s^2)
        self.total_mass = mass_cart + mass_pole

        # State: [x, x_dot, theta, theta_dot]
        # x: horizontal position of the cart
        # x_dot: horizontal velocity of the cart
        # theta: angle of the pole (radians)
        # theta_dot: angular velocity of the pole
        self.state = np.array([0.0, 0.0, 0.0, 0.0])

    def reset(self):
        """Reset the system to a random state near the upright position"""
        self.state = np.random.uniform(low=-0.05, high=0.05, size=4)
        # Ensure the pole starts close to upright position
        self.state[2] = np.random.uniform(low=-0.1, high=0.1)
        return self.state

    def step(self, force, dt=0.02):
        """Update the system state given an applied force"""
        x, x_dot, theta, theta_dot = self.state
        
        # Simplified equations of motion for the cart-pole system
        sin_theta = np.sin(theta)
        cos_theta = np.cos(theta)

        temp = (force + self.mass_pole * self.length * theta_dot**2 * sin_theta) / self.total_mass
        theta_acc = (self.gravity * sin_theta - cos_theta * temp) / \
                    (self.length * (4.0/3.0 - (self.mass_pole * cos_theta**2) / self.total_mass))
        
        x_acc = (force + self.mass_pole * self.length * (theta_dot**2 * sin_theta - theta_acc * cos_theta)) / self.total_mass
        
        # Update state
        x += x_dot * dt
        x_dot += x_acc * dt
        theta += theta_dot * dt
        theta_dot += theta_acc * dt

        self.state = np.array([x, x_dot, theta, theta_dot])
        
        # Calculate reward (more reward for keeping pole upright)
        reward = np.cos(theta)  # Maximum reward when pole is upright
        
        # Check if episode is done
        done = bool(
            x < -2.4 or x > 2.4 or  # Cart position limits
            theta < -np.pi/2 or theta > np.pi/2  # Pole angle limits
        )
        
        return self.state, reward, done

class SimplePIDController:
    """Simple AI controller using PID control to balance the pole"""
    def __init__(self, kp=5.0, ki=0.1, kd=2.0):
        self.kp = kp  # Proportional gain
        self.ki = ki  # Integral gain
        self.kd = kd  # Derivative gain
        self.prev_error = 0
        self.integral = 0
    
    def control(self, state):
        """Calculate control force based on current state"""
        # For the cart-pole system, we want to keep the pole upright (theta = 0)
        # and the cart at center (x = 0)
        x, x_dot, theta, theta_dot = state
        
        # Use both position and angle for control
        error = theta  # We want to keep the pole upright
        
        # PID control
        self.integral += error
        derivative = error - self.prev_error
        
        output = self.kp * error + self.ki * self.integral + self.kd * derivative
        
        self.prev_error = error
        
        # Apply force to cart (limited range)
        force = np.clip(output, -10, 10)
        
        return force
```

Now let's implement a function to run a simulation:

```python
def run_simulation():
    """Run a simulation of the cart-pole system with PID controller"""
    env = CartPole()
    controller = SimplePIDController()
    
    # Reset environment
    state = env.reset()
    
    # Store values for plotting
    steps = 500  # 10 seconds at 0.02s intervals
    positions = []
    angles = []
    forces = []
    
    total_reward = 0
    
    for step in range(steps):
        # Get force from controller
        force = controller.control(state)
        
        # Apply force to the environment
        state, reward, done = env.step(force)
        
        # Store values
        positions.append(state[0])
        angles.append(state[2])
        forces.append(force)
        
        total_reward += reward
        
        if done:
            print(f"Episode finished after {step} timesteps")
            break
    
    # Plot results
    time = np.arange(0, len(positions) * 0.02, 0.02)
    
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(10, 8))
    
    ax1.plot(time, positions)
    ax1.set_ylabel('Cart Position (m)')
    ax1.grid(True)
    
    ax2.plot(time, angles)
    ax2.set_ylabel('Pole Angle (rad)')
    ax2.set_xlabel('Time (s)')
    ax2.grid(True)
    
    ax3.plot(time, forces)
    ax3.set_ylabel('Applied Force (N)')
    ax3.set_xlabel('Time (s)')
    ax3.grid(True)
    
    plt.tight_layout()
    plt.show()
    
    print(f"Total reward: {total_reward:.2f}")
    
    return positions, angles, forces
```

## Running the System

Let's run the simulation:

```python
if __name__ == "__main__":
    # Run the simulation
    positions, angles, forces = run_simulation()
    
    print("\nSimulation completed!")
    print("The system attempted to balance the pole using a PID controller.")
    print("Try adjusting the PID parameters in SimplePIDController to see how it affects performance.")
```

## Exercise

1. Modify the PID parameters (kp, ki, kd) to see if you can achieve better performance.
2. Try implementing a different control strategy (e.g., LQR, neural network).
3. Add visualization to see the cart-pole system moving in real-time.

## Summary

In this lesson, we implemented our first Physical AI system - a cart-pole balancing system with a PID controller. This demonstrates the key concept of bridging AI algorithms with physical behaviors through simulation. The system responds to physical forces and constraints while applying intelligent control to achieve a goal.

This simple example lays the groundwork for more complex Physical AI systems involving robotics, autonomous vehicles, and other applications that interact with the physical world.

## Previous Lesson
Go back to [Lesson 1.2: Physics Simulation Fundamentals](/chapter-1/lesson-1-2) if you need to review the physics concepts.