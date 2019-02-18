<?php
defined('SECURITY_TOKEN') or exit('No direct script access allowed');

class reale
{

  /**
   * updateRecibos
   *
   * @param  mixed ¡
   *
   * @return void
   */
  function updateRecibos()
  {
    global $db;
    $empresa = [4, 10];
    $post['table'] = "Recibos";
    $dateini = date("Y-m", strtotime("-1 month", strtotime(date('Y-m-d')))) . "-01";
    $dateend = date("Y-m-d");
    $wsdl = "https://lba.realeonline.net/Reale.B2b.Services.Multitarificadores.IisHost/DescargaCompletaRecibos.svc?wsdl";
    foreach ($empresa as $emp) {
      $consulta = new SoapClient($wsdl, array(
        'uri' => "",
        'location' => $wsdl,
        'trace' => true,
        'exceptions' => false
      ));
      $parametros = array(
        'Empresa' => $emp,
        'Clave' => '12345',
        'Identificador' => 'ag34764w@TTLY9XPR',
        'FechaInicial' => $dateini,
        'FechaFinal' => $dateend,
        'IncluirPendientes' => true,
        'IncluirAnulados' => true,
        'IncluirCobrados' => true,
        'IncluirDevueltos' => true,
        'IncluirNuevos' => true,
      );
      $resultado = $consulta->DescargarNew($parametros);
        //echo json_encode($resultado);
      if (!isset($resultado->ListaRecibos->ReciboAmpliado)) {
        $result['success'] = false;
        $result['empresa'] = $emp;
        echo json_encode($result);
        echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
        return false;
      }
      $resultado = $resultado->ListaRecibos->ReciboAmpliado;
        // var_dump($resultado);
      //echo json_encode($resultado);
      $i = 0;
      foreach ($resultado as $key => $value) {
      // Conversiones de Fechas
        $FE = $value->FechaEfecto;
        $FS = $value->Situacion;
        $FV = $value->FechaVencimiento;
        $post['data']['FechaEfecto'] = substr($FE, 6, 4) . "-" . substr($FE, 3, 2) . "-" . substr($FE, 0, 2);
        $post['data']['Situacion'] = substr($FS, 6, 4) . "-" . substr($FS, 3, 2) . "-" . substr($FS, 0, 2);
        $post['data']['FechaVencimiento'] = substr($FV, 0, 4) . "-" . substr($FV, 5, 2) . "-" . substr($FV, 8, 2);
        $post['data']['CodigoRamo'] = $value->CodigoRamo;
        $post['data']['CodigoPoliza'] = $value->CodigoPoliza;
        $post['data']['CodigoRecibo'] = $value->CodigoRecibo;
        $post['data']['NombreTomador'] = $value->NombreTomador;
        $post['data']['Importe'] = $value->Importe;
        $post['data']['Estado'] = $value->Estado;
        $post['data']['CodigoMediador'] = $value->CodigoMediador;
        $post['data']['SubCodigoMediador'] = $value->SubCodigoMediador;
        $post['data']['CodigoGestor'] = $value->CodigoGestor;
        $post['data']['ImporteBonificacion'] = $value->ImporteBonificacion;
        $post['data']['ImporteNeto'] = $value->ImporteNeto;
        $post['data']['FormaPago'] = $value->FormaPago;
        $post['data']['Usuario'] = 0;
        $post['data']['CIA'] = $emp;
        $sql = $db->insertRecord($post);
        if (!$sql) {
          $post['idkey'] = "CodigoRecibo";
          $post['idvalue'] = $value->CodigoRecibo;
          $db->updateRecord($post);
          $result[$emp]['action'][$i] = "Updated";
        } else {
          $result[$emp]['action'][$i] = "Inserted";
        }
        $i++;
      }
      $result[$emp]['count'] = $i;
    }
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    exit();
  }

  /**
   * updatePolizas
   *
   * @return void
   */
  function updatePolizas()
  {
    global $db;
    // $empresa = [4, 10];
    $empresa = [4];
    $post['table'] = "Polizas";
    $dateini = date("Y-m", strtotime("-1 month", strtotime(date('Y-m-d')))) . "-01";
    // $dateini = date("Y-m", strtotime("-5 day", strtotime(date('Y-m-d')))) . "-01";
    $dateend = date("Y-m-d");
    $wsdl = "https://lba.realeonline.net/Reale.B2b.Services.Multitarificadores.IisHost/DescargaPolizas.svc?wsdl";
    $consulta = new SoapClient($wsdl, array(
      'uri' => "",
      'location' => $wsdl,
      'trace' => true,
      'exceptions' => false
    ));
    foreach ($empresa as $emp) {
      $parametros = array(
        'Empresa' => $emp,
        'Clave' => '12345',
        'Identificador' => 'ag34764w@TTLY9XPR',
        'FechaInicial' => $dateini,
        'FechaFinal' => $dateend,
        'TipoSuplemento1' => "NP",
        'TipoSuplemento2' => "AN"
      );
      $resultado = $consulta->Descargar($parametros);
      if (!isset($resultado->ListaPolizas->Poliza)) {
        $result['success'] = false;
        $result['empresa'] = $emp;
        echo json_encode($result);
        echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
        return false;
      }
      $resultado = $resultado->ListaPolizas->Poliza;
      //echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
      // exit();
      $i = 0;
      foreach ($resultado as $key => $value) {
            // Conversiones de Fechas
        $TD = array("CIF ", "NIF ", "NIE ");
        $post['data']['FechaAlta'] = substr($value->DatosGenerales->FechaAlta, 0, 10);
        $post['data']['FechaBaja'] = substr($value->DatosGenerales->FechaBaja, 0, 10);
        $post['data']['FechaVencimientoSuplemento'] = substr($value->DatosGenerales->FechaVencimientoSuplemento, 0, 10);
        $post['data']['Usuario'] = 0;
        $post['data']['CIA'] = $emp;
        $post['data']['Documento'] = str_replace($TD, '', $value->DatosGenerales->DatosTomador->Documento);
        $post['data']['CodigoPoliza'] = $value->DatosGenerales->CodigoPoliza;
        $post['data']['CodigoRecibo'] = $value->DatosGenerales->CodigoRecibo;
        $post['data']['Apellidos'] = $value->DatosGenerales->DatosTomador->Apellidos;
        $post['data']['Nombre'] = $value->DatosGenerales->DatosTomador->Nombre;
        $post['data']['NombreCompleto'] = $value->DatosGenerales->DatosTomador->Nombre == "" ? $value->DatosGenerales->DatosTomador->Apellidos
          : $value->DatosGenerales->DatosTomador->Nombre . " " . $value->DatosGenerales->DatosTomador->Apellidos;
        $post['data']['CodigoMediador'] = $value->DatosGenerales->CodigoMediador;
        $post['data']['Ramo'] = $value->DatosGenerales->Ramo;
        $post['data']['Modalidad'] = $value->DatosGenerales->Modalidad;
        $post['data']['CodigoModelo'] = $value->DatosAutos->CodigoModelo;
        $post['data']['Matricula'] = $value->DatosAutos->Matricula;
        $post['data']['SubCodigoMediador'] = $value->DatosGenerales->SubCodigoMediador;
        $post['data']['Importe'] = $value->DatosGenerales->ImporteNetoRecibo + $value->DatosGenerales->ImporteBonificacionRecibo;
        $post['data']['TipoInformacion'] = $value->DatosGenerales->TipoInformacion;
        $sql = $db->insertRecord($post);
        if (!$sql) {
          $post['idkey'] = "CodigoPoliza";
          $post['idvalue'] = $value->DatosGenerales->CodigoPoliza;
          $db->updateRecord($post);
          $result[$emp]['action'][$i] = "Updated";
        } else {
          $result[$emp]['action'][$i] = "Inserted";
        }
        $i++;
      }
      $result[$emp]['count'] = $i;
    }
    echo json_encode($result, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    exit();
  }



  /**
   * getRecibos
   *
   * @param  mixed (poliza)
   *
   * @return void
   */
  function getRecibos($post)
  {
    $wsdl = " https ://lba.realeonline.net/Reale.B2b.Services.Multitarificadores.IisHost/ConsultaRecibos.svc?wsdl";
    $consulta = new SoapClient($wsdl, array(
      'uri' => "",
      'location' => $wsdl,
      'trace' => true,
      'exceptions' => false
    ));
    $parametros = array(
      'Empresa' => 4,
      'Identificador' => 'ag34764w@TTLY9XPR',
      'CodigoPoliza' => $post['poliza'],
    );
    $resultado = $consulta->ObtenerListaRecibosPoliza($parametros);
    echo json_encode($resultado);
    exit();
  }

  /**
   * polizasMediador
   *
   * @return void
   */
  function polizasMediador()
  {

    $wsdl = "https://lba.realeonline.net/Reale.B2b.Services.Multitarificadores.IisHost/ConsultaPolizas.svc?wsdl";
    $consulta = new SoapClient($wsdl, array(
      'uri' => "",
      'location' => $wsdl,
      'trace' => true,
      'exceptions' => false
    ));
    $parametros = array(
      'Empresa' => 4,
      'Identificador' => 'ag34764w@TTLY9XPR',
      'CodigoMediador' => "34764"
    );
    $resultado = $consulta->ObtenerListaPolizasMediador($parametros);
        //$resultado = $resultado->ListaPolizas->Poliza;
    echo json_encode($resultado, JSON_PRETTY_PRINT | JSON_NUMERIC_CHECK);
    echo "Fin de actualización de Pólizas";
    exit();
  }

  /**
   * reportRecibos
   *
   * @param  mixed $post
   *
   * @return void
   */
  function reportRecibos($post)
  {
    global $db;
    $defaultLang = isset($post['lang']) ? $post['lang'] : 'es';
    $importeTotal = $importeParcial = $importeExtorno = 0;
    $url = "http://totsegur.synology.me/recibos/";
    require_once $defaultLang . '.php';
    $today = date('Y-m-d', strtotime('-' . $post['days'] . ' day', strtotime(date('Y-m-d'))));
        //Recibos Urgentes
    $post['subtable'] = false;
    $post['table'] = "Recibos";
    $post['orderby'] = "FechaEfecto DESC";
    $post['where'] = "(FechaEfecto<'$today') AND (Estado LIKE 'PENDIENTE%') AND (MIEstado = '' OR MIEstado LIKE 'PENDIENTE%')";
    $result['data']['Urgentes'] = $db->getRecords($post);
    $post['where'] = "(FechaEfecto<'$today') AND (Estado LIKE 'COBRADO%') AND (MIEstado LIKE 'ANULADO%')";
    $result['data']['Anulados'] = $db->getRecords($post);
        // Template
    $post['message'] = '<font face="calibri"><h3><strong>' . $lang['Resumen'] . '</strong></h3><p>' . $lang['Recibos'] . '<strong><span style="text-decoration: underline;"><span style="color: #ff0000;"><em>' . $lang['Urgentes'] . '</em></span></span></strong>:</p><ul>';
    foreach ($result['data']['Urgentes'] as $key => $value) {
      $post['message'] .= "<li>" . $lang['Fecha'] . $value['FechaEfecto'] . " || " . $lang['Recibo'] . "<a href='$url" . $value['CodigoRecibo'] . "'>" . $value['CodigoRecibo'] . "</a> || " . $lang['Poliza'] . $value['CodigoPoliza'] . " || " . $lang['Importe'] . $value['Importe'] . " || " . $lang['Cliente'] . $value['NombreTomador'] . "</li>";
      $importeParcial = $value['Importe'] > 0 ? $importeParcial + $value['Importe'] : $importeParcial;
      $importeExtorno = $value['Importe'] < 0 ? $importeExtorno + $value['Importe'] : $importeExtorno;
    }
    $importeTotal = $importeTotal + $importeParcial;
    $post['message'] .= "</ul><p>&nbsp;</p></br><b>" . $lang['Acumulado'] . " € </b>" . $importeParcial . " <b>" . $lang['Extornos'] . "</b>" . $importeExtorno . " €";
    $post['message'] .= '<p>' . $lang['Recibos'] . '<span style="text-decoration: underline; color: #800080;"><strong><em><span>' . $lang['Anulados'] . '</span></em></strong></span>:</p><ul>';
    $importeParcial = $importeExtorno = 0;
    foreach ($result['data']['Anulados'] as $key => $value) {
      $post['message'] .= "<li>" . $lang['Fecha'] . $value['FechaEfecto'] . " || " . $lang['Recibo'] . "<a href='$url" . $value['CodigoRecibo'] . "'>" . $value['CodigoRecibo'] . "</a> || " . $lang['Poliza'] . $value['CodigoPoliza'] . " || " . $lang['Cliente'] . $value['NombreTomador'] . "</li>";
      $importeParcial = $value['Importe'] > 0 ? $importeParcial + $value['Importe'] : $importeParcial;
      $importeExtorno = $value['Importe'] < 0 ? $importeExtorno + $value['Importe'] : $importeExtorno;
    }
    $importeTotal = $importeTotal + $importeParcial;
    $post['message'] .= "</ul><p>&nbsp;</p></br><b>" . $lang['Acumulado'] . " € </b>" . $importeParcial . " <b>" . $lang['Extornos'] . "</b>" . $importeExtorno . " €";
    $post['message'] .= "</br><p>&nbsp;</p><b>" . " TOTAL: </b>" . $importeTotal . " €";
    $post['message'] .= '</br><p><strong><span style="color: #008000;">CRC Reale</span></strong></p></font>';
    $post['subject'] = $lang['Resumen'] . " (" . date('Y-m-d') . ")";
    $db->sendMail($post);
    //echo json_encode($post['message'], JSON_PRETTY_PRINT);
  }
}