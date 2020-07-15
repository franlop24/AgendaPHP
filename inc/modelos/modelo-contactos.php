<?php 
    require_once('../funciones/bd.php');

    if( isset($_POST['accion']) && $_POST['accion'] == 'crear'){

        //validar las entradas

        $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
        $empresa = filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
        $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);

        try {
            $statement = $conn->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?, ?, ?)");
            $statement->bind_param("sss", $nombre, $empresa, $telefono);
            $statement->execute();
            if($statement->affected_rows == 1){
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'datos' => array(
                        'nombre' => $nombre,
                        'empresa' => $empresa,
                        'telefono' => $telefono,
                        'id_insertado' => $statement->insert_id
                    ) 
                );
            }
            $statement->close();
        } catch (Exception $e) {
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }

    if( isset($_GET['accion']) && $_GET['accion'] == 'borrar'){

        $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $statement = $conn->prepare("DELETE FROM contactos WHERE id = ? ");
            $statement->bind_param("i", $id);
            $statement->execute();
            if($statement->affected_rows == 1){
                $respuesta = array(
                    'respuesta' => 'correcto'
                );
            }
            $statement->close();
        } catch (Exception $e) {
            $respuesta = array(
                'error' => $e->getMessage()
            );
        }
        echo json_encode($respuesta);
    }

    $conn->close();


?>