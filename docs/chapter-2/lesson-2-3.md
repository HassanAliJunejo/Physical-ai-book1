---
sidebar_label: Lesson 2.3
sidebar_position: 3
---

# Lesson 2.3: Multi-Agent Physical Simulations

## Explain

In this final lesson of Chapter 2, we'll explore multi-agent Physical AI simulations, where multiple AI agents interact with each other and the environment simultaneously. This represents a significant step up in complexity from single-agent systems, as it introduces challenges like collision avoidance, resource competition, coordination, and emergent behaviors.

Multi-agent systems are crucial in Physical AI because many real-world scenarios involve multiple entities operating in the same space. Think of robot swarms in manufacturing, autonomous vehicles on roads, or robotic teams in search and rescue missions. These systems must handle not only environmental interactions but also complex inter-agent dynamics.

In this lesson, we'll build a simulation framework that allows multiple agents to coexist, interact, and potentially collaborate or compete within the same physical space.

## Show

Let's implement a multi-agent physical simulation framework:

```python
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict
import random

class Agent:
    """
    A Physical AI agent in the simulation
    """
    
    def __init__(self, position, agent_type='explorer'):
        self.position = np.array(position, dtype=float)
        self.velocity = np.array([0.0, 0.0])
        self.acceleration = np.array([0.0, 0.0])
        self.type = agent_type  # explorer, collector, defender, etc.
        self.max_speed = 1.0
        self.max_force = 0.2
        self.perception_radius = 5.0
        self.size = 0.3  # Physical size of the agent
        self.path = [position.copy()]  # Track movement path
        self.energy = 100.0  # Energy level (optional for future enhancements)
        
    def seek(self, target):
        """Seek a target position"""
        desired = target - self.position
        distance = np.linalg.norm(desired)
        
        if distance > 0:
            desired = desired / distance  # Normalize
            desired *= self.max_speed  # Scale to max speed
            
            steer = desired - self.velocity
            # Limit force
            if np.linalg.norm(steer) > self.max_force:
                steer = steer / np.linalg.norm(steer) * self.max_force
            return steer
        return np.array([0.0, 0.0])
    
    def separate(self, agents):
        """Steer to avoid crowding local agents"""
        steer = np.array([0.0, 0.0])
        count = 0
        
        for other in agents:
            if other != self:
                distance = np.linalg.norm(self.position - other.position)
                if 0 < distance < self.perception_radius:
                    diff = self.position - other.position
                    diff = diff / (distance * distance)  # Weight by distance
                    steer += diff
                    count += 1
        
        if count > 0:
            steer = steer / count
            if np.linalg.norm(steer) > 0:
                steer = steer / np.linalg.norm(steer) * self.max_speed
                steer = steer - self.velocity
                if np.linalg.norm(steer) > self.max_force:
                    steer = steer / np.linalg.norm(steer) * self.max_force
        
        return steer
    
    def align(self, agents):
        """Steer towards average heading of local agents"""
        steer = np.array([0.0, 0.0])
        count = 0
        
        for other in agents:
            if other != self:
                distance = np.linalg.norm(self.position - other.position)
                if 0 < distance < self.perception_radius:
                    steer += other.velocity
                    count += 1
        
        if count > 0:
            steer = steer / count
            if np.linalg.norm(steer) > 0:
                steer = steer / np.linalg.norm(steer) * self.max_speed
                steer = steer - self.velocity
                if np.linalg.norm(steer) > self.max_force:
                    steer = steer / np.linalg.norm(steer) * self.max_force
        
        return steer
    
    def cohesion(self, agents):
        """Steer to move toward center of local agents"""
        steer = np.array([0.0, 0.0])
        count = 0
        
        for other in agents:
            if other != self:
                distance = np.linalg.norm(self.position - other.position)
                if 0 < distance < self.perception_radius:
                    steer += other.position
                    count += 1
        
        if count > 0:
            steer = steer / count
            return self.seek(steer)  # Steer towards center
        return steer
    
    def apply_behaviors(self, agents, targets):
        """Apply multiple behaviors to the agent"""
        sep = self.separate(agents) * 1.5  # Separation is stronger
        ali = self.align(agents) * 1.0
        coh = self.cohesion(agents) * 1.0
        
        # Target seeking behavior for explorers
        if self.type == 'explorer' and targets:
            target = np.array(targets[0])
            seek_force = self.seek(target) * 1.0
            self.acceleration += seek_force
        
        self.acceleration += sep + ali + coh
    
    def update(self):
        """Update the agent's position and velocity"""
        self.velocity += self.acceleration
        # Limit speed
        if np.linalg.norm(self.velocity) > self.max_speed:
            self.velocity = self.velocity / np.linalg.norm(self.velocity) * self.max_speed
        
        self.position += self.velocity
        self.acceleration *= 0  # Reset acceleration
        self.path.append(self.position.copy())
        
        # Constrain to environment bounds
        self.position[0] = np.clip(self.position[0], self.size, 19.0 - self.size)
        self.position[1] = np.clip(self.position[1], self.size, 19.0 - self.size)

class MultiAgentSimulation:
    """
    A multi-agent physical simulation environment
    """
    
    def __init__(self, width=20, height=20):
        self.width = width
        self.height = height
        self.agents = []
        self.targets = []
        self.obstacles = []
        
    def add_agent(self, agent):
        """Add an agent to the simulation"""
        self.agents.append(agent)
        
    def add_target(self, position):
        """Add a target for agents to seek"""
        self.targets.append(position)
        
    def add_obstacle(self, position, size=1.0):
        """Add an obstacle to the environment"""
        self.obstacles.append({'position': np.array(position), 'size': size})
        
    def update(self):
        """Update all agents in the simulation"""
        for agent in self.agents:
            agent.apply_behaviors(self.agents, self.targets)
            agent.update()
    
    def visualize(self, step=0):
        """Visualize the simulation state"""
        plt.figure(figsize=(10, 8))
        
        # Plot agents
        for agent in self.agents:
            color = {'explorer': 'blue', 'collector': 'green', 'defender': 'red'}.get(agent.type, 'gray')
            plt.scatter(agent.position[0], agent.position[1], c=color, s=100, alpha=0.7, edgecolors='black')
            
            # Draw path for first agent
            if agent == self.agents[0]:
                path = np.array(agent.path)
                plt.plot(path[:, 0], path[:, 1], color=color, alpha=0.3)
        
        # Plot targets
        if self.targets:
            targets = np.array(self.targets)
            plt.scatter(targets[:, 0], targets[:, 1], c='yellow', s=200, marker='*', edgecolors='black', label='Targets')
        
        # Plot obstacles
        for obs in self.obstacles:
            circle = plt.Circle(obs['position'], obs['size'], color='brown', alpha=0.5)
            plt.gca().add_patch(circle)
        
        plt.xlim(0, self.width)
        plt.ylim(0, self.height)
        plt.title(f'Multi-Agent Physical Simulation - Step {step}')
        plt.xlabel('X Position')
        plt.ylabel('Y Position')
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.show()

# Example usage
sim = MultiAgentSimulation()

# Add agents
for i in range(5):
    pos = [random.uniform(2, 5), random.uniform(2, 5)]
    agent = Agent(pos, 'explorer')
    sim.add_agent(agent)

# Add targets
sim.add_target([15, 15])
sim.add_target([18, 10])

# Add some obstacles
for i in range(4):
    sim.add_obstacle([random.uniform(8, 12), random.uniform(8, 12)])

# Run simulation
for step in range(100):
    sim.update()
    if step % 20 == 0:  # Visualize every 20 steps
        sim.visualize(step)

print("Multi-Agent Simulation completed!")
```

This example demonstrates a multi-agent physical simulation where agents exhibit behaviors like separation, alignment, and cohesion (similar to flocking algorithms) while also seeking targets and avoiding obstacles. The agents operate independently but interact with each other through these behavioral rules.

## Do

Now it's time to enhance the multi-agent simulation! Your challenge is to implement additional features that make the simulation more realistic and complex:

1. Implement different agent types with specialized behaviors
2. Add resource collection and sharing mechanisms
3. Create environmental dynamics that change over time
4. Implement communication protocols between agents

Here's the starter code with TODO sections:

```python
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Tuple, Dict
import random

class EnhancedAgent:
    """
    An enhanced Physical AI agent with specialized behaviors and communication
    """
    
    def __init__(self, position, agent_type='explorer'):
        self.position = np.array(position, dtype=float)
        self.velocity = np.array([0.0, 0.0])
        self.acceleration = np.array([0.0, 0.0])
        self.type = agent_type
        self.max_speed = 1.0
        self.max_force = 0.2
        self.perception_radius = 5.0
        self.size = 0.3
        self.path = [position.copy()]
        self.energy = 100.0
        self.resources = 0  # Amount of collected resources
        
        # TODO: Add agent-specific properties based on type
        # For example:
        # - Explorer: Better perception range, seeks new areas
        # - Collector: Better resource gathering, efficient movement
        # - Defender: Protective behavior, shields other agents
        # - Researcher: Analyzes environment, shares knowledge
        
        # TODO: Add communication capabilities
        # - Communication range
        # - Message types they can send/receive
        # - Memory of received messages
        pass
    
    def communicate(self, agents):
        """
        Share information with nearby agents
        """
        # TODO: Implement communication logic
        # - Share resource locations
        # - Warn about hazards
        # - Coordinate activities
        pass
    
    def specialized_behavior(self, environment):
        """
        Execute type-specific behavior
        """
        # TODO: Implement specialized behavior based on agent type
        pass
    
    # TODO: Enhance the existing methods (seek, separate, align, cohesion)
    # with additional logic for:
    # - Energy conservation
    # - Resource management
    # - Communication with other agents
    # - Environmental adaptation

class DynamicEnvironment:
    """
    An environment with changing conditions
    """
    
    def __init__(self, width=20, height=20):
        self.width = width
        self.height = height
        self.agents = []
        self.resources = []
        self.hazards = []
        self.time = 0
        
    def update_environment(self):
        """
        Update environmental conditions over time
        """
        # TODO: Implement dynamic changes such as:
        # - Resources appearing/disappearing
        # - Hazards moving or appearing
        # - Weather conditions affecting agent movement
        # - Obstacles changing positions
        pass
        
    def add_resource(self, position, amount=10):
        """
        Add a resource that agents can collect
        """
        # TODO: Add resource with properties like:
        # - Amount available
        # - Replenishment rate
        # - Type (affects which agents can collect it)
        pass
        
    def check_resource_collection(self, agent):
        """
        Check if an agent is near a collectible resource
        """
        # TODO: Implement resource collection logic
        pass

class EnhancedMultiAgentSimulation:
    """
    Enhanced simulation with multiple agent types and dynamic environment
    """
    
    def __init__(self, width=20, height=20):
        self.width = width
        self.height = height
        self.agents = []
        self.environment = DynamicEnvironment(width, height)
        
    def run_step(self):
        """
        Run one simulation step
        """
        # TODO: Implement comprehensive simulation step:
        # 1. Update environmental conditions
        # 2. Agents perceive environment
        # 3. Agents communicate with each other
        # 4. Agents compute actions based on perception and communication
        # 5. Agents execute actions
        # 6. Handle interactions (collisions, resource collection, etc.)
        # 7. Update agent states (energy, resources, etc.)
        pass
        
    def visualize(self, step=0):
        """
        Visualize the simulation state with additional information
        """
        # TODO: Enhance visualization to show:
        # - Different agent types with distinct visuals
        # - Resource locations and amounts
        # - Communication links between agents
        # - Agent resource levels or energy
        pass

# Challenge: Create a scenario where agents must collaborate
# to achieve a common goal, like collecting all resources
# before they disappear or before a hazard appears

print("Enhanced Multi-Agent Simulation Challenge")
print("Implement the missing features and run your advanced simulation!")
```

Try implementing these advanced features to create a complex multi-agent physical simulation. This will deepen your understanding of how multiple Physical AI agents can interact, communicate, and collaborate in shared physical environments.