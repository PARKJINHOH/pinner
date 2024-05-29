/**
 * Alert 컴포넌트
 * ※ 화면 중앙에 나오는 Toast가 아님.
 */
function AlertComponent(props) {
  return (
    <Stack sx={{ width: '100%', padding: '10px' }} spacing={2}>
      <Alert severity={props.type}>{props.message}</Alert>
    </Stack>
  );
}

function errorAlert(str) {
  return <AlertComponent type='error' message={str} />;
}

function warningAlert(str) {
  return <AlertComponent type='warning' message={str} />;
}

function infoAlert(str) {
  return <AlertComponent type='info' message={str} />;
}

function successAlert(str) {
  return <AlertComponent type='info' message={str} />;
}

export { errorAlert, infoAlert, successAlert, warningAlert };
