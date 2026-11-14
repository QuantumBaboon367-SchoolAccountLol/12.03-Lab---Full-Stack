var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res) {
    const task = (req.body.task || '').trim();

    // Prevent empty or whitespace-only tasks
    if (!task) {
        return res.redirect('/');
    }

    req.db.query(
        'INSERT INTO todos (task, completed) VALUES (?, 0);',
        [task],
        (err, results) => {
            if (err) {
                console.error('Error adding todo:', err);
                return res.status(500).send('Error adding todo');
            }

            res.redirect('/');
        }
    );
});

router.post('/edit', function (req, res) {
    const { id } = req.body;
    const task = (req.body.task || '').trim();

    if (!task) {
        return res.redirect('/');
    }

    req.db.query(
        'UPDATE todos SET task = ? WHERE id = ?;',
        [task, id],
        (err, results) => {
            if (err) {
                console.error('Error editing todo:', err);
                return res.status(500).send('Error editing todo');
            }

            res.redirect('/');
        }
    );
});

router.post('/complete', function (req, res) {
    const { id } = req.body;

    req.db.query(
        'UPDATE todos SET completed = 1 WHERE id = ?;',
        [id],
        (err, results) => {
            if (err) {
                console.error('Error completing todo:', err);
                return res.status(500).send('Error completing todo');
            }

            res.redirect('/');
        }
    );
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

module.exports = router;