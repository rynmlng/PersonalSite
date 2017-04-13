def user_prompt(message, answers=None):
    """ Prompt a user for an answer to a question, retrying until valid input is provided. """
    user_answer = None

    if answers:
        message += ' (' + '/'.join(answers) + ') > '

        user_answer = None
        while user_answer not in answers:
            user_answer = raw_input(message).strip()
    else:
        _ = raw_input(message + ' (enter any key to continue)')

    return user_answer


