import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// In-memory array to store projects
let localProjects = [];

// GET Route to fetch projects
app.get('/api/projects', (req, res) => {
    res.status(200).json(localProjects);
});

// POST Route to create/add a project
app.post('/api/projects', (req, res) => {
    const newProject = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description || 'No description provided.',
        language: req.body.language || 'JavaScript',
        stargazers_count: 0,
        html_url: req.body.html_url || '#'
    };

    localProjects.push(newProject);
    res.status(201).json({ message: 'Project created successfully', data: newProject });
});

app.listen(PORT, () => {
    console.log(`Backend server is running at http://localhost:${PORT}`);
});
