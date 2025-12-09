---
sidebar_label: Lesson 2.2
sidebar_position: 2
---

# Lesson 2.2: Dynamic Response Systems

## Explain

In the previous lesson, we explored how Physical AI systems perceive their environment. Now, let's dive into dynamic response systems - the mechanisms that allow AI agents to react appropriately to environmental changes and sensor inputs in real-time. These systems are essential for creating physical AI that can adapt to dynamic environments and interact meaningfully with objects and other agents.

Dynamic response systems in Physical AI are analogous to our reflexes and adaptive behaviors. Just as we automatically pull our hand away from a hot surface or adjust our walking pattern on uneven terrain, Physical AI systems need to respond quickly and appropriately to changing conditions. These responses must be computed in real-time, often with limited computational resources.

This lesson will cover how to design and implement control systems that enable real-time decision-making based on sensor inputs, creating responsive Physical AI agents.

## Show

Let's implement a dynamic response system that allows an agent to react to environmental stimuli:

```python
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, List, Dict

class DynamicResponseController:
    """
    A dynamic response controller for Physical AI agents.
    Responds to environmental stimuli in real-time.
    """
    
    def __init__(self, max_force=5.0, reaction_time=0.1):
        """
        Initialize the controller
        
        Args:
            max_force: Maximum force the agent can apply
            reaction_time: Time to process sensor inputs and respond
        """
        self.max_force = max_force
        self.reaction_time = reaction_time
        self.velocity = np.array([0.0, 0.0])
        self.position = np.array([0.0, 0.0])
        self.forces_applied = []
        
    def calculate_response(self, sensor_data: List[Dict]) -> np.ndarray:
        """
        Calculate the appropriate response based on sensor data
        
        Args:
            sensor_data: List of objects detected by sensors
            
        Returns:
            Force vector to apply to the agent
        """
        total_force = np.zeros(2)
        
        for obj in sensor_data:
            # Calculate direction and distance to object
            obj_pos = np.array(obj['position'])
            to_obj = obj_pos - self.position
            distance = np.linalg.norm(to_obj)
            
            if distance > 0:
                # Normalize direction vector
                dir_to_obj = to_obj / distance
                
                # Apply different behaviors based on object type
                if obj['type'] == 'obstacle':
                    # Repel from obstacles
                    repulsion_force = -dir_to_obj / (distance ** 2)
                    total_force += repulsion_force * self.max_force * 0.5
                elif obj['type'] == 'target':
                    # Attract towards targets
                    attraction_force = dir_to_obj / distance
                    total_force += attraction_force * self.max_force * 0.3
                elif obj['type'] == 'hazard':
                    # Strong repulsion from hazards
                    repulsion_force = -dir_to_obj / (distance ** 1.5)
                    total_force += repulsion_force * self.max_force * 0.8
        
        # Limit the maximum force
        force_magnitude = np.linalg.norm(total_force)
        if force_magnitude > self.max_force:
            total_force = (total_force / force_magnitude) * self.max_force
            
        return total_force
    
    def update(self, sensor_data: List[Dict], dt: float) -> Tuple[np.ndarray, np.ndarray]:
        """
        Update the agent's state based on sensor data and time step
        
        Args:
            sensor_data: List of objects detected by sensors
            dt: Time step
            
        Returns:
            New position and velocity of the agent
        """
        # Calculate response force
        force = self.calculate_response(sensor_data)
        self.forces_applied.append(force)
        
        # Apply force to update velocity (F = ma, assuming m=1)
        acceleration = force
        self.velocity += acceleration * dt
        
        # Limit maximum speed
        speed = np.linalg.norm(self.velocity)
        if speed > self.max_force * 0.5:
            self.velocity = (self.velocity / speed) * (self.max_force * 0.5)
        
        # Update position
        self.position += self.velocity * dt
        
        return self.position.copy(), self.velocity.copy()

# Example usage
controller = DynamicResponseController(max_force=3.0, reaction_time=0.1)

# Simulate sensor data (objects detected by the agent)
sensor_data = [
    {
        'position': (5, 2),
        'type': 'obstacle',
        'distance': 5.39,
        'angle': 21.8
    },
    {
        'position': (7, 8),
        'type': 'target',
        'distance': 10.63,
        'angle': 54.46
    }
]

# Set initial position
controller.position = np.array([3.0, 3.0])

# Simulate the agent's behavior over time
positions = [controller.position.copy()]
dt = 0.1  # Time step
for t in range(50):  # Simulate for 50 steps
    pos, vel = controller.update(sensor_data, dt)
    positions.append(pos.copy())

positions = np.array(positions)

print(f"Agent started at position {sensor_data[0]['position']}")
print(f"Final position after responses: ({positions[-1][0]:.2f}, {positions[-1][1]:.2f})")

# Plot the agent's path
plt.figure(figsize=(10, 8))
plt.plot(positions[:, 0], positions[:, 1], 'b-', linewidth=2, label='Agent Path')
plt.scatter(positions[0, 0], positions[0, 1], color='green', s=100, label='Start', zorder=5)
plt.scatter(positions[-1, 0], positions[-1, 1], color='red', s=100, label='End', zorder=5)
plt.scatter([5, 7], [2, 8], c=['orange', 'yellow'], s=150, marker='s', label='Objects', zorder=5)
plt.title('Dynamic Response System - Agent Navigation')
plt.xlabel('X Position')
plt.ylabel('Y Position')
plt.legend()
plt.grid(True, alpha=0.3)
plt.axis('equal')
plt.show()
```

This example demonstrates a dynamic response system that allows an agent to navigate around obstacles while moving toward targets. The system processes sensor data in real-time to compute appropriate forces that guide the agent's movement.

## Do

Now it's your turn to build upon this dynamic response system! Your task is to extend the controller with additional features:

1. Implement a memory system that allows the agent to remember previous locations of objects
2. Add a learning component that helps the agent improve its responses over time
3. Create a simulation environment where multiple agents interact with each other

Here's the starter code with TODO sections:

```python
import numpy as np
import matplotlib.pyplot as plt
from typing import Tuple, List, Dict
import random

class AdvancedDynamicController:
    """
    An advanced dynamic response controller with memory and learning capabilities.
    """
    
    def __init__(self, max_force=5.0, reaction_time=0.1):
        self.max_force = max_force
        self.reaction_time = reaction_time
        self.velocity = np.array([0.0, 0.0])
        self.position = np.array([0.0, 0.0])
        self.forces_applied = []
        
        # TODO: Add memory system to track object positions over time
        # Hints:
        # 1. Track historical positions of objects
        # 2. Track object movement patterns
        # 3. Store successful and unsuccessful responses
        
        # TODO: Add learning system to improve responses
        # Hints:
        # 1. Reward successful behaviors (reaching targets, avoiding hazards)
        # 2. Penalize unsuccessful behaviors (hitting obstacles)
        # 3. Adjust response parameters based on experience
        
    def calculate_response(self, sensor_data: List[Dict]) -> np.ndarray:
        """
        Calculate response based on current sensor data and learned behaviors
        """
        # TODO: Implement enhanced response calculation that incorporates:
        # 1. Historical object data from memory
        # 2. Learned response patterns
        # 3. Adaptive parameters based on previous experiences
        
        # YOUR CODE HERE
        total_force = np.zeros(2)
        return total_force
    
    def learn_from_outcome(self, sensor_data: List[Dict], action_result: Dict):
        """
        Learn from the outcome of previous actions
        """
        # TODO: Implement learning algorithm that updates response parameters
        # based on the success or failure of previous actions
        pass

class MultiAgentEnvironment:
    """
    Environment with multiple agents that interact with each other
    """
    
    def __init__(self, width=20, height=20):
        self.width = width
        self.height = height
        self.agents = []
        
    def add_agent(self, agent: AdvancedDynamicController):
        """Add an agent to the environment"""
        # TODO: Position the agent randomly or at specified location
        self.agents.append(agent)
        
    def step(self, dt: float):
        """Update all agents in the environment"""
        # TODO: Implement environment update logic
        # 1. Each agent processes its sensor data (including other agents)
        # 2. Each agent calculates its response
        # 3. Update agent positions and states
        # 4. Handle agent-agent interactions
        pass
        
    def visualize(self):
        """Visualize the environment with all agents"""
        # TODO: Create a visualization showing:
        # 1. All agents and their positions
        # 2. Environmental objects
        # 3. Agent paths or trails
        pass

# Challenge: Create a multi-agent simulation where agents must collaborate
# or compete to achieve goals in a shared environment
print("Advanced Dynamic Response Challenge")
print("Implement the memory and learning systems and create a multi-agent simulation!")
```

Try implementing the advanced features and running your multi-agent simulation. This will help you understand how complex Physical AI systems respond dynamically to their environment and adapt their behaviors over time.