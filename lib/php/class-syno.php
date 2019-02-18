<?php
defined('SECURITY_TOKEN') or exit('No direct script access allowed');

class syno
{
  /**
   * login
   *
   * @param  mixed $post
   *
   * @return void
   */
  function login($post)
  {
    $data = file_get_contents('http://localhost:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&account=' . $post['user'] . '&passwd=' . $post['pass'] . '&session=FileStation&format=sid');
    $result = json_decode($data);
    if ($result->success) {
      $result = json_decode($data);
      $result->info = $this->getUserInfo($result->data->sid);
      $result->users = $this->getUsersMail($result->data->sid);
    }
    return $result;
  }

  /**
   * logout
   *
   * @param  mixed $post
   *
   * @return void
   */
  function logout($post)
  {
    if (isset($post[sid])) {
      $data = file_get_contents('http://localhost:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout&_sid=' . $post['sid']);
      return $data;
    } else {
      $data = file_get_contents('http://localhost:5000/webapi/auth.cgi?api=SYNO.API.Auth&version=1&method=logout');
      return $data;
    }
  }

  /**
   * getUsersMail
   *
   * @param  mixed $sid
   *
   * @return void
   */
  function getUsersMail($sid)
  {
    $data = file_get_contents('http://localhost:5000/webapi/entry.cgi?type="local"&offset=0&limit=-1&additional=["email","description","expired"]&api=SYNO.Core.User&method=list&version=1&_sid=' . $sid);
    $result = json_decode($data);
    if ($result->success) {
      return $result;
    } else {
      return false;
    }
  }

  /**
   * getUserInfo
   *
   * @param  mixed $sid
   *
   * @return void
   */
  function getUserInfo($sid)
  {
    $data = file_get_contents('http://localhost:5000/webapi/entry.cgi?api=SYNO.Core.NormalUser&method=get&version=1&_sid=' . $sid);
    $result = json_decode($data);
    if ($result->success) {
      return $result;
    } else {
      return false;
    }
  }
}