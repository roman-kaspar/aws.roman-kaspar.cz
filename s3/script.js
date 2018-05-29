$(() => {
  const ELB_URL = 'http://aws-api.roman-kaspar.cz/api/v1/info';
  const APIGW_URL = 'https://aws-lambda.roman-kaspar.cz/testing-lambda';

  const ec2Button = $('#ec2-button');
  const lambdaButton = $('#lambda-button');

  const ec2Output = $('#ec2-output');
  const lambdaOutput = $('#lambda-output');

  const convert2html = (json) => JSON.stringify(json, null, 4).replace(new RegExp('\n', 'g'), '<br/>').replace(new RegExp(' ', 'g'), '&nbsp');

  const getEc2Info = () => {
    ec2Button.prop('disabled', true);
    $.ajax(ELB_URL, {
      success: (data) => { ec2Output.html(convert2html(data)); },
      error: () => { ec2Output.text('--- error: query failed ---'); },
      complete: () => { ec2Button.prop('disabled', false); }
    });
  };

  const getLambdaInfo = () => {
    lambdaButton.prop('disabled', true);
    $.ajax(APIGW_URL, {
      success: (data) => { lambdaOutput.html(convert2html(data)); },
      error: () => { lambdaOutput.text('--- error: query failed ---'); },
      complete: () => { lambdaButton.prop('disabled', false); }
    });
  };

  ec2Button.click(getEc2Info);
  lambdaButton.click(getLambdaInfo);

  getEc2Info();
  getLambdaInfo();
});
