<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restore Database</title>
</head>
<body>
    <h1>Restore Database</h1>
    <form action="/restore" method="post" enctype="multipart/form-data">
        <input type="file" name="backupFile" required>
        <button type="submit">Restore</button>
    </form>
</body>
</html>
