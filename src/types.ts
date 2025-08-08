export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type AIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

export type Exercise = {
  name: string;
  description: string;
  sets: number;
  reps: number;
  muscles: string[];
}

export type Training = {
  name: string;
  exercises: Exercise[];
}

export type AIWorkoutResponse = {
  workouts: Training[];
};
