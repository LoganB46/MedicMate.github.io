def gcs_calculator():
    print("Glascow Coma Scale (GCS) Calculator")

    #Eye opening Response
    print("\nEye Opening Response:")
    print("1: No eye opening")
    print("2: Eye opening to pain")
    print("3: Eye opening to verbal command")
    print("4: Eye opening spontaneously")
    eye_opening = int(input("Enter the score for eye opening (1-4):"))

    #Verbal Response
    print("\nVerbal Response:")
    print("1: No verbal response")
    print("2: Incomprehensible sounds")
    print("3: Inappropriate words")
    print("4: Confused")
    print("5: Oriented")
    verbal_response = int(input("Enter the score for verbal response (1-5):"))

    #Motor Response
    print("\nMotor Response:")
    print("1: No motor response")
    print("2: Extention to pain (decerebrate response)")
    print("3: Flexion to pain (decorticate response)")
    print("4: Withdrawal from pain")
    print("5: Localizing pain")
    print("6: Obeys commands")
    motor_response = int(input("Enter the score for the motor reposne (1-6):"))

    #Calculating the total GCS score
    gcs_score = eye_opening + verbal_response + motor_response

    #Output the results
    print("\nTotal GCS Score:", gcs_score)

    #Interpretation fo the GCS score
    if gcs_score <= 8:
        print("Interpretation: Severe head injury")
    elif gcs_score <= 12:
        print("Interpretation: Moderate head injury")
    else:
        print("Interpretation: Mild head injury")

        #Run the calculator
        gcs_calculator()