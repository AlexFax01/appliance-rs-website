<?php
echo json_encode(['php' => PHP_VERSION, 'gd' => extension_loaded('gd'), 'fileinfo' => extension_loaded('fileinfo'), 'mbstring' => extension_loaded('mbstring')]);
