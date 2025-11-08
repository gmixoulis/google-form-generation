// Main execution functions - run these to generate the forms

function createTrainerForm() {
  const trainerJson = getTrainerJson();
  const spec = JSON.parse(trainerJson);
  const url = createFormFromBatchUpdateSpec(spec);
  Logger.log('Trainer Form URL: ' + url);
  return url;
}


function createBothForms() {
  const trainerUrl = createTrainerForm();
  Logger.log('Trainee Form: ' + traineeUrl);
}