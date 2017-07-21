<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo htmlspecialchars($results['pageTitle'])?></title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Bree+Serif|Numans">
    <link rel="stylesheet" type="text/css" href="style.css" />
  </head>
  <body>
    <div id="container">
      <header>
         <a href="."><img id="logo" src="images/logo.png" alt="LT CMS"/></a>
         <h1>
             <?php echo htmlspecialchars($results['pageTitle'])?>
         </h1>
      </header>

